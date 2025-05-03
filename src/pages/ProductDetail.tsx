
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, addToCart } = useStore();
  const product = getProductById(id || '');
  
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/products/all')}>
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="border-t border-b py-4">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Availability:
                {product.stockQuantity > 0 ? (
                  <span className="text-green-600 ml-2">In Stock ({product.stockQuantity} available)</span>
                ) : (
                  <span className="text-red-600 ml-2">Out of Stock</span>
                )}
              </p>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center border rounded-md">
                <button 
                  className="p-2 border-r hover:bg-gray-100" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <span className="w-12 text-center">{quantity}</span>
                
                <button 
                  className="p-2 border-l hover:bg-gray-100" 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart} 
              disabled={product.stockQuantity === 0}
              size="lg"
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            {/* Additional Information */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="font-semibold mb-1">Category</h3>
                <p className="text-gray-700 capitalize">{product.category}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Shipping Information</h3>
                <p className="text-gray-700">Free shipping on bulk orders above $500</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">Return Policy</h3>
                <p className="text-gray-700">30-day return policy for unused items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
