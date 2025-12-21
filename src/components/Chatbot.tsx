import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, ShoppingCart, Heart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface ChatbotProps {
  products: Product[];
  onAddToCart: (product: Product, selectedSize?: string) => void;
  onAddToFavorites: (product: Product) => void;
  onProductSelect: (productId: number) => void;
  onOpenCart: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({
  products,
  onAddToCart,
  onAddToFavorites,
  onProductSelect,
  onOpenCart
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    products?: Product[];
  }>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [conversationStage, setConversationStage] = useState<'greeting' | 'preferences' | 'suggestions' | 'checkout'>('greeting');
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addBotMessage("👋 Hello! Welcome to Zidansh Fashion! I'm your personal shopping assistant. I can help you find the perfect outfit based on your preferences. What kind of style are you looking for today? (e.g., Kurtis, Kurti sets, Suits and Dress)");
        setConversationStage('preferences');
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, products?: Product[]) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'bot' as const,
      timestamp: new Date(),
      products
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'user' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    addUserMessage(currentInput);
    const userInput = currentInput.toLowerCase();
    setCurrentInput('');

    // Process user input based on conversation stage
    setTimeout(() => {
      if (conversationStage === 'preferences') {
        handlePreferences(userInput);
      } else if (conversationStage === 'suggestions') {
        handleSuggestions(userInput);
      }
    }, 1000);
  };

  const handlePreferences = (input: string) => {
    const preferences = [];

    if (input.includes('traditional') || input.includes('ethnic') || input.includes('indian')) {
      preferences.push('traditional');
    }
    if (input.includes('modern') || input.includes('contemporary')) {
      preferences.push('modern');
    }
    if (input.includes('casual') || input.includes('everyday')) {
      preferences.push('casual');
    }
    if (input.includes('formal') || input.includes('office')) {
      preferences.push('formal');
    }
    if (input.includes('color') || input.includes('bright') || input.includes('vibrant')) {
      preferences.push('colorful');
    }
    if (input.includes('simple') || input.includes('minimal')) {
      preferences.push('simple');
    }

    setUserPreferences(preferences);

    if (preferences.length > 0) {
      const suggestedProducts = getProductSuggestions(preferences);
      addBotMessage(`Great! Based on your preference for ${preferences.join(', ')} styles, here are some recommendations:`, suggestedProducts);
      setConversationStage('suggestions');
    } else {
      addBotMessage("I see! Let me show you our popular collections. Here are some trending items:");
      const popularProducts = products.slice(0, 4);
      addBotMessage("", popularProducts);
      setConversationStage('suggestions');
    }
  };

  const handleSuggestions = (input: string) => {
    if (input.includes('add') || input.includes('cart') || input.includes('buy')) {
      addBotMessage("Great choice! I've added that item to your cart. Would you like to proceed to checkout or see more products?");
    } else if (input.includes('checkout') || input.includes('purchase')) {
      addBotMessage("Perfect! Let me take you to the checkout page.");
      setTimeout(() => {
        onOpenCart();
        setIsOpen(false);
      }, 1000);
    } else if (input.includes('more') || input.includes('another') || input.includes('different')) {
      const newSuggestions = getProductSuggestions(userPreferences);
      addBotMessage("Here are more options for you:", newSuggestions);
    } else {
      addBotMessage("Is there anything specific you'd like to know about these products? Or would you like me to help you with checkout?");
    }
  };

  const getProductSuggestions = (preferences: string[]): Product[] => {
    // Simple filtering logic based on preferences
    let filteredProducts = [...products];

    if (preferences.includes('traditional')) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes('kurti') ||
        p.name.toLowerCase().includes('suit') ||
        p.name.toLowerCase().includes('ethnic')
      );
    }

    if (preferences.includes('casual')) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes('combo') ||
        p.name.toLowerCase().includes('coord')
      );
    }

    // Return up to 4 products
    return filteredProducts.slice(0, 4);
  };

  const handleProductAction = (product: Product, action: 'cart' | 'favorite' | 'view') => {
    if (action === 'cart') {
      onAddToCart(product);
      addBotMessage(`✅ Added ${product.name} to your cart! Would you like to checkout now or continue shopping?`);
    } else if (action === 'favorite') {
      onAddToFavorites(product);
      addBotMessage(`❤️ Added ${product.name} to your favorites!`);
    } else if (action === 'view') {
      onProductSelect(product.id);
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  console.log('Chatbot component is rendering');

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-28 md:bottom-32 right-6 z-[10000]">
        <button
          onClick={() => {
            console.log('Chatbot button clicked');
            setIsOpen(!isOpen);
          }}
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white text-white rounded-full shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ring-2 ring-pink-200 shadow-pink-200 shadow-lg border-2 border-pink-300"
          style={{
            boxShadow: '0 0 15px rgba(236, 72, 153, 0.3), 0 0 30px rgba(236, 72, 153, 0.2), 0 0 45px rgba(236, 72, 153, 0.1)',
            filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.3)) brightness(1.05)',
            animation: 'bounce 2s infinite'
          }}
          aria-label="Open shopping assistant"
        >
          <Bot className="w-6 h-6 md:w-7 md:h-7 drop-shadow-lg text-pink-500" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-ping">
            !
          </div>
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-44 md:bottom-52 right-6 w-80 md:w-96 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
          {/* Logo Section */}
          <div className="relative flex justify-center items-center p-4 bg-gradient-to-r from-pink-400 to-pink-500 rounded-t-lg">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg">
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-pink-600 text-white">
            <div className="flex items-center gap-2">
              <span className="font-medium">Zidansh Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-pink-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.text}</p>

                  {/* Product suggestions */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg p-2 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <img
                              src={`../../zidansh img/realimg/${product.image}`}
                              alt={product.name}
                              className="w-12 h-12 object-contain rounded"
                              onError={(e) => {
                                e.currentTarget.src = '../../zidansh img/realimg/img1.jpg'; // Fallback image
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{product.name}</p>
                              <p className="text-xs text-pink-600 font-bold">₹{product.price}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            <button
                              onClick={() => handleProductAction(product, 'view')}
                              className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleProductAction(product, 'cart')}
                              className="flex-1 text-xs bg-pink-600 hover:bg-pink-700 text-white px-2 py-1 rounded transition-colors flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Add
                            </button>
                            <button
                              onClick={() => handleProductAction(product, 'favorite')}
                              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                            >
                              <Heart className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
