
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const { getProductsByCategory } = useStore();
  const [filteredProducts, setFilteredProducts] = useState(getProductsByCategory(category || 'all'));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  
  // Update products when category changes
  useEffect(() => {
    const products = getProductsByCategory(category || 'all');
    setFilteredProducts(products);
  }, [category, getProductsByCategory]);
  
  // Apply search and sorting
  useEffect(() => {
    let products = getProductsByCategory(category || 'all');
    
    // Apply search filter
    if (searchQuery) {
      products = products.filter(
        product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortOption === 'price-low') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      products = [...products].sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredProducts(products);
  }, [category, searchQuery, sortOption, getProductsByCategory]);
  
  // Get category title
  const getCategoryTitle = () => {
    switch (category) {
      case 'men':
        return "Men's Collection";
      case 'women':
        return "Women's Collection";
      case 'kids':
        return "Kids' Collection";
      default:
        return "All Products";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">{getCategoryTitle()}</h1>
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
