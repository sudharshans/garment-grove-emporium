
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { state, getProductsByCategory } = useStore();
  const featuredProducts = state.products.slice(0, 4);
  const menProducts = getProductsByCategory('men').slice(0, 3);
  const womenProducts = getProductsByCategory('women').slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Premium Wholesale Garments for Your Business
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              High-quality fabrics, competitive pricing, and reliable delivery for retailers and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/products/all">Browse Collection</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Products</h2>
            <Link to="/products/all" className="text-primary hover:underline">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/products/men" className="relative group overflow-hidden rounded-lg">
              <div className="aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1516826957135-700dedea698c" 
                  alt="Men's Collection"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-display font-bold">Men</h3>
                  <p className="mt-2">Professional attire for men</p>
                </div>
              </div>
            </Link>
            
            <Link to="/products/women" className="relative group overflow-hidden rounded-lg">
              <div className="aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956" 
                  alt="Women's Collection"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-display font-bold">Women</h3>
                  <p className="mt-2">Elegant professional wear</p>
                </div>
              </div>
            </Link>
            
            <Link to="/products/kids" className="relative group overflow-hidden rounded-lg">
              <div className="aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1622290291165-d341f1c92eb1" 
                  alt="Kids' Collection"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-display font-bold">Kids</h3>
                  <p className="mt-2">School uniforms and more</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Men's Collection Preview */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Men's Collection</h2>
            <Link to="/products/men" className="text-primary hover:underline">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Women's Collection Preview */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Women's Collection</h2>
            <Link to="/products/women" className="text-primary hover:underline">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {womenProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Why Choose Us Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-12 text-center">Why Choose Garment Grove?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                All our garments are made with premium materials to ensure longevity and customer satisfaction.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                We pride ourselves on efficient logistics and quick delivery to keep your business running.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-100 rounded-lg shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Pricing</h3>
              <p className="text-gray-600">
                Get wholesale rates that help your business maximize profitability without compromising on quality.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust Garment Grove for their wholesale clothing needs.
          </p>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            <Link to="/register">Create Business Account</Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
