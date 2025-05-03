
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const OrdersPage = () => {
  const { state } = useStore();
  const navigate = useNavigate();
  
  if (!state.currentUser) {
    navigate('/login');
    return null;
  }
  
  const userOrders = state.orders.filter(order => order.userId === state.currentUser?.id);
  const isEmpty = userOrders.length === 0;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-8">Your Orders</h1>
        
        {isEmpty ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium mb-4">No orders found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <a href="/products/all">Start Shopping</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Order #{order.id.slice(-8)}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">Status:</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-right mt-2">
                        <span className="font-semibold">
                          Total: ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <h3 className="text-sm font-semibold mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.product.id} className="flex items-center">
                        <div className="h-16 w-16 rounded-md overflow-hidden">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-gray-600">
                            {item.quantity} × ${item.product.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right font-medium">
                          ${(item.quantity * item.product.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default OrdersPage;
