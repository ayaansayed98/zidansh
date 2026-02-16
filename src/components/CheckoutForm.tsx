import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Info, Mail, Phone, X, CreditCard, Banknote } from 'lucide-react';
import { analyticsService } from '../lib/analytics';
import { inventoryService } from '../lib/inventory';
import { saveCartItems } from '../lib/storage';
import { validateForm, FORM_SCHEMAS } from '../lib/validation';

interface CartItem {
  id: string;
  productId?: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  category?: string;
}

interface OrderData {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  amount: number;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state?: string;
    pincode?: string;
  };
  createdAt: string;
  paymentMethod?: string;
  deliveryCharge?: number;
  discount?: number;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  additionalNotes?: string;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  totalAmount?: number;
  onOrderComplete: (orderData: OrderData) => void;
  navigate?: (path: string) => void;
  onClose?: () => void;
  onRemoveItem?: (item: CartItem) => void;
  isModal?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  totalAmount,
  onOrderComplete,
  navigate: propNavigate,
  onClose = () => { },
  onRemoveItem = () => { },
  isModal = false,
}): JSX.Element => {
  const routerNavigate = useNavigate();
  // Use prop navigation if provided, otherwise use router
  const navigate = propNavigate || routerNavigate;

  const baseUrl = import.meta.env.BASE_URL || '/';

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Indian cities database
  const indianCities: Record<string, string[]> = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 'Anantapur', 'Eluru', 'Ongole', 'Nizamabad', 'Warangal', 'Karimnagar', 'Khammam'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Bomdila', 'Tawang', 'Ziro', 'Along', 'Daporijo', 'Anini'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar', 'Dhubri', 'Goalpara', 'Barpeta', 'North Lakhimpur', 'Hojai'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Sasaram', 'Dehri'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Durg', 'Korba', 'Rajnandgaon', 'Raigarh', 'Ambikapur', 'Dhamtari', 'Jagdalpur', 'Mahasamund', 'Bhatapara', 'Dalli-Rajhara', 'Chirmiri', 'Kawardha'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cortalim', 'Quepem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Nadiad', 'Mehsana', 'Porbandar', 'Palanpur', 'Vapi', 'Valsad'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jhajjar', 'Palwal'],
    'Himachal Pradesh': ['Shimla', 'Solan', 'Dharamshala', 'Mandi', 'Palampur', 'Kullu', 'Manali', 'Chamba', 'Una', 'Bilaspur', 'Hamirpur', 'Nahan', 'Sundernagar', 'Kangra', 'Mandi'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chakradharpur', 'Lohardaga', 'Chatra', 'Koderma', 'Tatisilwai'],
    'Karnataka': ['Bengaluru', 'Hubballi', 'Mysuru', 'Mangaluru', 'Belagavi', 'Gulbarga', 'Davanagere', 'Ballari', 'Bijapur', 'Shimoga', 'Tumakuru', 'Udupi', 'Raichur', 'Mandya', 'Hassan'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha', 'Palakkad', 'Malappuram', 'Kannur', 'Kasaragod', 'Kottayam', 'Idukki', 'Ernakulam', 'Pathanamthitta', 'Wayanad'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Pimpri-Chinchwad', 'Aurangabad', 'Solapur', 'Amravati', 'Navi Mumbai', 'Kolhapur', 'Sangli', 'Malegaon', 'Akola', 'Latur'],
    'Manipur': ['Imphal', 'Thoubal', 'Churachandpur', 'Bishnupur', 'Kakching', 'Lilong', 'Mayang Imphal', 'Jiribam', 'Kangpokpi', 'Ukhrul', 'Senapati', 'Tamenglong', 'Chandel', 'Noney', 'Tengnoupal'],
    'Meghalaya': ['Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Baghmara', 'Mawsynram', 'Cherrapunji', 'Nongpoh', 'Williamnagar', 'Resubelpara', 'Amlarem', 'Khliehriat', 'Mawkyrwat', 'Mawphlang', 'Mawsram'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai', 'Saitual', 'Hnahthial', 'Thenzawl', 'Biate', 'Khawhai', 'Khawzawl', 'Lengpui'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Mon', 'Peren', 'Tseminyu', 'Chumoukedima', 'Niuland', 'Tobu'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Cuttack', 'Kendrapara', 'Jagatsinghpur', 'Rayagada', 'Jajpur'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Moga', 'Firozpur', 'Batala', 'Abohar', 'Hoshiarpur', 'Kapurthala', 'Barnala', 'Muktsar'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Bharatpur', 'Sriganganagar', 'Pali', 'Churu', 'Tonk', 'Kishangarh'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang', 'Pakyong', 'Ravangla', 'Lachung', 'Lachen', 'Yuksom', 'Pelling', 'Rumtek', 'Zuluk'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Tirunelveli', 'Thanjavur', 'Nagercoil', 'Sivakasi', 'Kanchipuram'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Miryalaguda', 'Siddipet', 'Suryapet', 'Jagtial', 'Kamareddy', 'Medak'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Pratapgarh', 'Kailashahar', 'Belonia', 'Khowai', 'Teliamura', 'Sepahijala', 'Kumarghat', 'Ranirbazar', 'Sonamura', 'Jampui Hills', 'Sabroom', 'Amarpur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Jhansi', 'Firozabad'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh', 'Kashipur', 'Rudrapur', 'Kashipur', 'Kotdwar', 'Ramnagar', 'Pithoragarh', 'Uttarkashi', 'Champawat', 'Bageshwar', 'Tehri'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Raniganj', 'Bardhaman', 'Malda', 'Midnapore', 'Kharagpur', 'Haldia', 'Baharampur', 'Krishnanagar', 'Bankura', 'Jalpaiguri'],
    'Andaman and Nicobar Islands': ['Port Blair', 'Car Nicobar', 'Havelock', 'Neil Island', 'Mayabunder', 'Diglipur', 'Little Andaman', 'Great Nicobar', 'Long Island', 'Rangat'],
    'Chandigarh': ['Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur', 'Kharar', 'Derabassi', 'Lalru', 'Dera Bassi', 'Mullanpur', 'Landran'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Silvassa', 'Daman', 'Diu', 'Vapi', 'Valsad', 'Bhilad', 'Sanjan', 'Karambeli', 'Udvada', 'Vapi'],
    'Delhi': ['New Delhi', 'Old Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North East Delhi', 'North West Delhi', 'South West Delhi', 'Faridabad', 'Gurgaon', 'Noida', 'Ghaziabad', 'Bahadurgarh'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kulgam', 'Pulwama', 'Shopian', 'Budgam', 'Ganderbal', 'Bandipora', 'Kupwara', 'Rajouri', 'Poonch', 'Doda'],
    'Ladakh': ['Leh', 'Kargil', 'Zanskar', 'Nubra', 'Changthang', 'Drass', 'Suru Valley', 'Sham Valley', 'Pangong', 'Tso Moriri'],
    'Lakshadweep': ['Kavaratti', 'Agatti', 'Bangaram', 'Kadmat', 'Kalpeni', 'Minicoy', 'Amini', 'Kiltan', 'Chetlat', 'Bitra'],
    'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Auroville', 'Oulgaret', 'Mannadipet', 'Villianur', 'Bahour', 'Thirunallar']
  };

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    additionalNotes: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const quickPaymentMethods = [
    { id: 'online', name: 'Online Payment', description: 'Cards, UPI, NetBanking', icon: CreditCard },
    { id: 'cash', name: 'Cash', description: 'On Delivery', icon: Banknote }
  ];

  const orderCalculations = useMemo(() => {
    const subtotal = totalAmount ?? cartItems.reduce((sum: number, item: CartItem) =>
      sum + (item.price * (item.quantity || 1)), 0);

    const delivery = subtotal > 1000 ? 0 : 50;
    const cash = selectedPaymentMethod === 'cash' ? 50 : 0;
    const discountAmount = appliedCoupon ? (appliedCoupon.discount / 100) * subtotal : 0;
    const total = subtotal + delivery + cash - discountAmount;

    return {
      subtotal,
      total,
      delivery,
      cash,
      discount: discountAmount
    };
  }, [totalAmount, cartItems, selectedPaymentMethod, appliedCoupon]);

  const generateOrderId = useCallback((): string => {
    return `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  const citiesForSelectedState = formData.state ? indianCities[formData.state] || [] : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'state') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        city: ''
      }));
    }
  };

  const handlePaymentMethodSelect = useCallback((method: string) => {
    setSelectedPaymentMethod(method);
    // Clear relevant error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.payment;
      delete newErrors.paymentMethod;
      return newErrors;
    });
  }, []);

  const applyCoupon = () => {
    const validCoupons = [
      { code: 'WELCOME10', discount: 10 },
      { code: 'FREESHIP', discount: 100 },
      { code: 'ZIDANSH5', discount: 5 }
    ];

    const coupon = validCoupons.find(c => c.code === couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      setErrors(prev => ({ ...prev, coupon: '' }));
    } else {
      setErrors(prev => ({ ...prev, coupon: 'Invalid coupon code' }));
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setErrors(prev => ({ ...prev, coupon: '' }));
  };

  const validateFormData = (): boolean => {
    const dataToValidate = {
      ...formData,
      paymentMethod: selectedPaymentMethod
    };

    console.log('Validating data:', dataToValidate);

    const validation = validateForm(dataToValidate, FORM_SCHEMAS.checkout);
    const finalErrors = { ...validation.errors };
    if (finalErrors.paymentMethod) {
      finalErrors.payment = finalErrors.paymentMethod;
      delete finalErrors.paymentMethod;
    }

    setErrors(finalErrors);
    console.log('Validation result:', validation.isValid, finalErrors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = generateOrderId();
      const orderData: OrderData = {
        orderId,
        status: 'pending',
        amount: orderCalculations.total,
        items: cartItems,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        createdAt: new Date().toISOString(),
        paymentMethod: selectedPaymentMethod,
        deliveryCharge: orderCalculations.delivery,
        discount: orderCalculations.discount
      };

      if (selectedPaymentMethod !== 'cash') {
        // Redirect to PayU Payment Link
        window.location.href = 'https://dashboard-staging.payu.in/pay/CEA92A7D1F0DF1D5EEFE3E1157B0EE08';
        return;
      } else {
        console.log('Processing Cash Payment...');
        try {
          console.log('Updating stock...');
          await inventoryService.updateStock(cartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            name: item.name
          })));
          console.log('Stock updated.');

          // Clear cart
          saveCartItems([]);
          // Dispatch event to clear cart in UI
          window.dispatchEvent(new Event('cartUpdated'));

          // Navigate to success page
          const successUrl = `/payment/success?status=success&orderId=${orderId}&amount=${orderCalculations.total}`;
          console.log('Navigating to:', successUrl);
          navigate(successUrl);
          return;
        } catch (stockError) {
          console.error('Stock update failed:', stockError);
          setErrors(prev => ({
            ...prev,
            general: 'Failed to update stock. Please try again.'
          }));
          // If stock update fails, we do NOT proceed to payment success.
          // We should stop here.
          throw stockError; // Re-throw to be caught by outer catch and terminate process
        }
      }

      analyticsService.trackInteraction({
        product_name: 'Order Completed',
        product_brand: 'Checkout',
        product_price: orderCalculations.total,
        interaction_type: 'purchase',
        user_session: `order_${orderId}`
      });

      onOrderComplete(orderData);

    } catch (error) {
      console.error('Order submission error:', error);
      setErrors(prev => ({
        ...prev,
        general: error instanceof Error ? error.message : 'An error occurred while processing your order'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateFinalTotal = (): number => {
    return orderCalculations.total;
  };

  return (
    <div className={`${isModal ? 'bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col' : 'h-full flex flex-col'}`}>
      <div className="relative w-full max-w-5xl mx-auto bg-white shadow-xl flex flex-col h-[90vh] my-8 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Order Summary */}
          <div className="w-full md:w-2/5 lg:w-96 bg-gray-50 p-4 border-r border-gray-200 overflow-y-auto">
            <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              {(() => {
                const groupedItems = cartItems.reduce((acc: Record<string, any>, item: CartItem) => {
                  const key = item.size ? `${item.id}-${item.size}` : item.id;
                  if (!acc[key]) {
                    acc[key] = {
                      ...item,
                      quantity: 0,
                      totalPrice: 0
                    };
                  }
                  acc[key].quantity += item.quantity || 1;
                  acc[key].totalPrice += item.price * (item.quantity || 1);
                  return acc;
                }, {});

                return (
                  <React.Fragment key="grouped-items">
                    {Object.values(groupedItems).map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm p-3 bg-white rounded border">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || `${baseUrl}zidansh img/realimg/img1.jpg`}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAyMEgzOFYyMEgzOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <button
                              onClick={() => {
                                if (navigate && item.id) {
                                  navigate(`/product/${item.id}`);
                                }
                              }}
                              className="font-medium text-gray-900 hover:text-blue-600 bg-transparent border-none p-0 text-left cursor-pointer text-sm truncate"
                            >
                              {item.name || 'Unknown Product'}
                            </button>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                                ₹{item.totalPrice}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveItem(item);
                                }}
                                className="p-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {item.size && <span>Size: {item.size} • </span>}
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                );
              })()}
            </div>
            <div className="border-t pt-2 space-y-1.5">
              <div className="flex justify-between text-sm py-0.5">
                <span>Subtotal</span>
                <span className="font-medium">₹{orderCalculations.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center py-0.5">
                <div className="flex items-center gap-1">
                  <span>Delivery</span>
                  <div className="relative group">
                    <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-40 text-center z-10">
                      Free delivery on orders above ₹999
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                <span>₹{orderCalculations.delivery.toFixed(2)}</span>
              </div>
              {selectedPaymentMethod === 'cash' && (
                <div className="flex justify-between text-sm items-center py-0.5">
                  <div className="flex items-center gap-1">
                    <span>Cash on Delivery</span>
                    <div className="relative group">
                      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        No extra charges on online payments
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                  <span>₹{orderCalculations.cash.toFixed(2)}</span>
                </div>
              )}
              {appliedCoupon && appliedCoupon.code && (
                <div className="flex justify-between text-sm text-green-600 py-0.5">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-₹{orderCalculations.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex justify-between font-medium text-base">
                <span>Total</span>
                <span>₹{orderCalculations.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Wrapper for Form and Buttons (Right Side) */}
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Customer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your complete address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                        >
                          <option value="">Select State</option>
                          {indianStates.map((state: string) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!formData.state}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.city ? 'border-red-500' : 'border-gray-300'} ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                          <option value="">
                            {formData.state ? 'Select City' : 'Select State First'}
                          </option>
                          {citiesForSelectedState.map((city: string) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Pincode"
                        />
                        {errors.pincode && (
                          <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Coupon Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${errors.coupon ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && appliedCoupon.code && (
                    <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-2">
                      <span className="text-green-700 text-sm">
                        Coupon {appliedCoupon.code} applied! {appliedCoupon.discount}% off
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {errors.coupon && (
                    <p className="text-red-500 text-sm mt-1">{errors.coupon}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickPaymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => handlePaymentMethodSelect(method.id)}
                        className={`p-4 border rounded-lg text-center hover:border-pink-500 transition-colors ${selectedPaymentMethod === method.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                      >
                        <method.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                        <div className="text-sm font-medium">{method.name}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </button>
                    ))}
                  </div>
                  {errors.payment && (
                    <p className="text-red-500 text-sm mt-2">{errors.payment}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Fixed Submit Button */}
            <div className="bg-white border-t border-gray-200 p-6 z-10 w-full">
              <div className="flex gap-4 w-full justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors w-1/3"
                  disabled={isProcessing} // Disable cancel during processing too
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log('Payment button clicked');
                    handleSubmit(e);
                  }}
                  disabled={isProcessing}
                  className="flex-1 px-8 py-4 bg-black text-pink-700 rounded-lg hover:bg-gray-900 hover:text-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xl shadow-2xl border-2 border-black hover:border-gray-900 transform hover:scale-105 relative z-20 w-2/3"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <span>Pay ₹{calculateFinalTotal()}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
