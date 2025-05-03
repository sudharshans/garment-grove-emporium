
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/contexts/StoreContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="product-card animate-fadeIn">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-image"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddToCart} 
              className="flex items-center gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:inline">Add</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
