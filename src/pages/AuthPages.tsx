import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, login } = useStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (!state.error) {
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const handleDemoLogin = async (userType: 'admin' | 'user') => {
    const demoEmail = userType === 'admin' ? 'admin@example.com' : 'user@example.com';
    const demoPassword = 'password123'; // Simple demo password
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    try {
      await login(demoEmail, demoPassword);
      toast.success(`Demo ${userType} login successful!`);
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo login failed. Please ensure demo accounts are set up in Supabase.');
    }
  };
  
  // Redirect if already logged in
  useEffect(() => {
    if (state.currentUser) {
      // Redirect admin to admin dashboard, others to home
      if (state.currentUser.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [state.currentUser, navigate]);
  
  if (state.currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            {state.error && (
              <div className="text-red-600 text-sm">{state.error}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={state.loading}>
              {state.loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
          
          {/* Quick Demo Login */}
          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Quick Demo Login</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleDemoLogin('admin')}
              >
                Login as Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleDemoLogin('user')}
              >
                Login as Customer
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { state, register } = useStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    setPasswordError('');
    await register(name, email, password);
    
    if (!state.error) {
      toast.success('Registration successful! Welcome to Garment Grove.');
    }
  };
  
  // Redirect if already logged in
  useEffect(() => {
    if (state.currentUser) {
      navigate('/');
    }
  }, [state.currentUser, navigate]);
  
  if (state.currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold">Create Account</h1>
            <p className="text-gray-600 mt-2">Sign up for wholesale garment shopping</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
            </div>
            
            {state.error && (
              <div className="text-red-600 text-sm">{state.error}</div>
            )}
            
            <Button type="submit" className="w-full" disabled={state.loading}>
              {state.loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
