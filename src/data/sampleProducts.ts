import { Product } from '../types/product';

export const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Yellow, grey and white printed kurta with trousers',
    brand: 'Zidansh Collection',
    description: 'Traditional kurta with modern print design, perfect for festive occasions',
    category: 'Ethnic Wear',
    cloth_type: 'Kurta with Trousers',
    basePrice: 275,
    baseOriginalPrice: 399,
    rating: 4.5,
    reviews: 1234,
    discount: 31,
    images: ['img1.jpg', 'img1.1.jpg', 'img1.2.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', '2XL']
      },
      {
        id: 'attr_color',
        name: 'Color',
        values: ['Yellow', 'Grey', 'White']
      }
    ],
    variations: [
      {
        id: 'var_1_1',
        sku: 'PRD001-S-Yellow',
        attributes: { Size: 'S', Color: 'Yellow' },
        price: 275,
        originalPrice: 399,
        stock: 25,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_2',
        sku: 'PRD001-M-Yellow',
        attributes: { Size: 'M', Color: 'Yellow' },
        price: 275,
        originalPrice: 399,
        stock: 20,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_3',
        sku: 'PRD001-L-Yellow',
        attributes: { Size: 'L', Color: 'Yellow' },
        price: 275,
        originalPrice: 399,
        stock: 0,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_4',
        sku: 'PRD001-XL-Yellow',
        attributes: { Size: 'XL', Color: 'Yellow' },
        price: 275,
        originalPrice: 399,
        stock: 12,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_5',
        sku: 'PRD001-2XL-Yellow',
        attributes: { Size: '2XL', Color: 'Yellow' },
        price: 285,
        originalPrice: 419,
        stock: 3,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_6',
        sku: 'PRD001-S-Grey',
        attributes: { Size: 'S', Color: 'Grey' },
        price: 275,
        originalPrice: 399,
        stock: 20,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_7',
        sku: 'PRD001-M-Grey',
        attributes: { Size: 'M', Color: 'Grey' },
        price: 275,
        originalPrice: 399,
        stock: 18,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_8',
        sku: 'PRD001-L-Grey',
        attributes: { Size: 'L', Color: 'Grey' },
        price: 275,
        originalPrice: 399,
        stock: 4,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_9',
        sku: 'PRD001-XL-Grey',
        attributes: { Size: 'XL', Color: 'Grey' },
        price: 275,
        originalPrice: 399,
        stock: 10,
        lowStockThreshold: 5,
        isActive: true
      },
      {
        id: 'var_1_10',
        sku: 'PRD001-2XL-Grey',
        attributes: { Size: '2XL', Color: 'Grey' },
        price: 285,
        originalPrice: 419,
        stock: 0,
        lowStockThreshold: 5,
        isActive: true
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: 2,
    name: 'Elegant blue and gold embroidered sherwani',
    brand: 'Zidansh Collection',
    description: 'Luxurious sherwani with intricate gold embroidery, perfect for weddings',
    category: 'Ethnic Wear',
    cloth_type: 'Sherwani',
    basePrice: 899,
    baseOriginalPrice: 1299,
    rating: 4.8,
    reviews: 892,
    discount: 31,
    images: ['img2.jpg', 'img2.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      {
        id: 'var_2_1',
        sku: 'PRD002-S',
        attributes: { Size: 'S' },
        price: 899,
        originalPrice: 1299,
        stock: 5,
        lowStockThreshold: 3,
        isActive: true
      },
      {
        id: 'var_2_2',
        sku: 'PRD002-M',
        attributes: { Size: 'M' },
        price: 899,
        originalPrice: 1299,
        stock: 12,
        lowStockThreshold: 3,
        isActive: true
      },
      {
        id: 'var_2_3',
        sku: 'PRD002-L',
        attributes: { Size: 'L' },
        price: 899,
        originalPrice: 1299,
        stock: 8,
        lowStockThreshold: 3,
        isActive: true
      },
      {
        id: 'var_2_4',
        sku: 'PRD002-XL',
        attributes: { Size: 'XL' },
        price: 899,
        originalPrice: 1299,
        stock: 15,
        lowStockThreshold: 3,
        isActive: true
      },
      {
        id: 'var_2_5',
        sku: 'PRD002-2XL',
        attributes: { Size: '2XL' },
        price: 949,
        originalPrice: 1399,
        stock: 6,
        lowStockThreshold: 3,
        isActive: true
      },
      {
        id: 'var_2_6',
        sku: 'PRD002-3XL',
        attributes: { Size: '3XL' },
        price: 999,
        originalPrice: 1499,
        stock: 2,
        lowStockThreshold: 3,
        isActive: true
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: 3,
    name: 'Casual cotton shirt with denim jeans',
    brand: 'Zidansh Collection',
    description: 'Comfortable casual wear perfect for everyday outings',
    category: 'Casual Wear',
    cloth_type: 'Shirt and Jeans',
    basePrice: 455,
    baseOriginalPrice: 699,
    rating: 4.3,
    reviews: 2156,
    discount: 35,
    images: ['img3.jpg', 'img3.1.jpg', 'img3.2.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', '2XL']
      },
      {
        id: 'attr_fit',
        name: 'Fit',
        values: ['Slim', 'Regular', 'Relaxed']
      }
    ],
    variations: [
      {
        id: 'var_3_1',
        sku: 'PRD003-S-Slim',
        attributes: { Size: 'S', Fit: 'Slim' },
        price: 455,
        originalPrice: 699,
        stock: 25,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_2',
        sku: 'PRD003-M-Slim',
        attributes: { Size: 'M', Fit: 'Slim' },
        price: 455,
        originalPrice: 699,
        stock: 30,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_3',
        sku: 'PRD003-L-Slim',
        attributes: { Size: 'L', Fit: 'Slim' },
        price: 455,
        originalPrice: 699,
        stock: 18,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_4',
        sku: 'PRD003-XL-Slim',
        attributes: { Size: 'XL', Fit: 'Slim' },
        price: 455,
        originalPrice: 699,
        stock: 0,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_5',
        sku: 'PRD003-2XL-Slim',
        attributes: { Size: '2XL', Fit: 'Slim' },
        price: 475,
        originalPrice: 729,
        stock: 7,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_6',
        sku: 'PRD003-S-Regular',
        attributes: { Size: 'S', Fit: 'Regular' },
        price: 455,
        originalPrice: 699,
        stock: 22,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_7',
        sku: 'PRD003-M-Regular',
        attributes: { Size: 'M', Fit: 'Regular' },
        price: 455,
        originalPrice: 699,
        stock: 35,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_8',
        sku: 'PRD003-L-Regular',
        attributes: { Size: 'L', Fit: 'Regular' },
        price: 455,
        originalPrice: 699,
        stock: 28,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_9',
        sku: 'PRD003-XL-Regular',
        attributes: { Size: 'XL', Fit: 'Regular' },
        price: 455,
        originalPrice: 699,
        stock: 15,
        lowStockThreshold: 8,
        isActive: true
      },
      {
        id: 'var_3_10',
        sku: 'PRD003-2XL-Regular',
        attributes: { Size: '2XL', Fit: 'Regular' },
        price: 475,
        originalPrice: 729,
        stock: 10,
        lowStockThreshold: 8,
        isActive: true
      }
    ],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-01')
  }
];
