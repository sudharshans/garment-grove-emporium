
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const CartPage = () => {
  const { state, updateCartItem, removeFromCart, createOrder } = useStore();
  const navigate = useNavigate();
  
  const cartItems = state.cart;
  const isEmpty = cartItems.length === 0;
  
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );
  
  const handleQuantityChange = (productId: string, newQuantity: number, stockQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > stockQuantity) {
      toast.error(`Cannot add more than ${stockQuantity} items`);
      return;
    }
    
    updateCartItem(productId, newQuantity);
  };
  
  const handleCheckout = () => {
    if (!state.currentUser) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    
    createOrder();
    toast.success('Order placed successfully!');
    navigate('/orders');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">Shopping Cart</h1>
        
        {isEmpty ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
              <Link to="/products/all">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map(item => (
                      <tr key={item.product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                              <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${item.product.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center border rounded-md">
                            <button 
                              className="p-1 hover:bg-gray-100"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1, item.product.stockQuantity)}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button 
                              className="p-1 hover:bg-gray-100"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.product.stockQuantity)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <div className="text-gray-600">Subtotal</div>
                    <div className="font-medium">${subtotal.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between border-b pb-4">
                    <div className="text-gray-600">Shipping</div>
                    <div className="font-medium">Calculated at checkout</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-gray-600">Total</div>
                    <div className="font-semibold text-xl">${subtotal.toFixed(2)}</div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full mt-6"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4">
                  <Link
                    to="/products/all"
                    className="text-primary text-sm hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;
