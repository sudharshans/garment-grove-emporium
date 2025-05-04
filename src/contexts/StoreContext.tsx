import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Supabase client setup with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase configuration is available
const isSuabaseConfigured = supabaseUrl && supabaseKey;
export const supabase = isSuabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  stockQuantity: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
};

type State = {
  currentUser: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'CREATE_ORDER'; payload: Order }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: State = {
  currentUser: null,
  products: [],
  cart: [],
  orders: [],
  loading: false,
  error: null
};

const storeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === action.payload.product.id
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cart: updatedCart };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item => 
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'CREATE_ORDER':
      return { 
        ...state, 
        orders: [...state.orders, action.payload],
        cart: [] // Clear cart after order is created
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Mock products data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White Shirt',
    price: 25.99,
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
    category: 'men',
    description: 'High-quality cotton white shirt for professionals. Perfect for formal and semi-formal occasions. Available in bulk orders.',
    stockQuantity: 200
  },
  {
    id: '2',
    name: 'Slim Fit Chinos',
    price: 34.50,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
    category: 'men',
    description: 'Comfortable slim fit chinos that work well for both business casual and weekend wear. Made from durable cotton blend.',
    stockQuantity: 150
  },
  {
    id: '3',
    name: 'Business Blazer',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
    category: 'men',
    description: 'Professional business blazer with modern cut. Perfect for completing any formal outfit. Available in navy, black, and grey.',
    stockQuantity: 80
  },
  {
    id: '4',
    name: 'Women\'s Blouse',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c',
    category: 'women',
    description: 'Elegant women\'s blouse suitable for professional settings. Made from breathable, wrinkle-resistant fabric.',
    stockQuantity: 120
  },
  {
    id: '5',
    name: 'Pencil Skirt',
    price: 39.95,
    imageUrl: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754',
    category: 'women',
    description: 'Classic pencil skirt for professional women. Features a comfortable stretch fabric and elegant silhouette.',
    stockQuantity: 90
  },
  {
    id: '6',
    name: 'Women\'s Suit Set',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1632149877166-f75d49000351',
    category: 'women',
    description: 'Complete women\'s suit set including blazer and matching bottoms. Perfect for corporate environments.',
    stockQuantity: 60
  },
  {
    id: '7',
    name: 'Kids School Uniform Shirt',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8',
    category: 'kids',
    description: 'Durable school uniform shirts for children. Stain-resistant and easy to iron. Available in white and light blue.',
    stockQuantity: 300
  },
  {
    id: '8',
    name: 'Kids Uniform Trousers',
    price: 19.50,
    imageUrl: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7',
    category: 'kids',
    description: 'Comfortable uniform trousers with adjustable waistband. Perfect for daily school wear. Available in navy and grey.',
    stockQuantity: 250
  }
];

// Context Creation
type StoreContextType = {
  state: State;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  addToCart: (product: Product, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: () => void;
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Load initial data
  useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
    
    // Check for stored cart in localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      parsedCart.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
      });
    }
    
    // Only attempt Supabase operations if configured
    if (isSuabaseConfigured && supabase) {
      // Check for current Supabase session
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          try {
            // Get user profile from database
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching profile:', error);
              return;
            }
            
            if (profile) {
              const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || 'User',
                isAdmin: profile.is_admin || false
              };
              dispatch({ type: 'SET_USER', payload: user });
              console.log('User authenticated:', user);
            }
          } catch (error) {
            console.error('Session check error:', error);
          }
        }
      };
      
      checkSession();
      
      // Setup auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (event === 'SIGNED_IN' && session) {
            try {
              // Get user profile from database
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching profile on sign in:', error);
                return;
              }
              
              if (profile) {
                const user: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profile.name || 'User',
                  isAdmin: profile.is_admin || false
                };
                dispatch({ type: 'SET_USER', payload: user });
              } else {
                // If no profile exists yet, this might be a new auth but profile insert failed
                console.error('No profile found for user:', session.user.id);
                dispatch({ type: 'SET_ERROR', payload: 'Profile not found. Please register again.' });
              }
            } catch (error) {
              console.error('Error during auth state change:', error);
            }
          } else if (event === 'SIGNED_OUT') {
            dispatch({ type: 'SET_USER', payload: null });
          }
        }
      );
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    } else {
      // If Supabase is not configured, show a message
      console.warn('Supabase URL or API key is missing. Authentication features will not work.');
      toast.error('Authentication is not configured. Please set up Supabase environment variables.');
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Auth functions
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    if (!isSuabaseConfigured || !supabase) {
      dispatch({ type: 'SET_ERROR', payload: 'Authentication is not configured' });
      toast.error('Authentication is not configured. Please set up Supabase environment variables.');
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    
    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error(error.message);
        return;
      }
      
      if (data.user) {
        console.log('Login successful for:', data.user.email);
        
        // Get user profile from database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          dispatch({ type: 'SET_ERROR', payload: 'Error fetching user profile' });
          return;
        }
          
        if (profile) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: profile.name || 'User',
            isAdmin: profile.is_admin || false
          };
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          console.error('No profile found for user:', data.user.id);
          dispatch({ type: 'SET_ERROR', payload: 'User profile not found' });
        }
      }
    } catch (error) {
      console.error('Login exception:', error);
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error(error.message);
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'An unknown error occurred' });
        toast.error('An unknown error occurred during login');
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    if (!isSuabaseConfigured || !supabase) {
      dispatch({ type: 'SET_ERROR', payload: 'Authentication is not configured' });
      toast.error('Authentication is not configured');
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error('Error signing out');
        return;
      }
      
      dispatch({ type: 'SET_USER', payload: null });
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Logout exception:', error);
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    if (!isSuabaseConfigured || !supabase) {
      dispatch({ type: 'SET_ERROR', payload: 'Authentication is not configured' });
      toast.error('Authentication is not configured. Please set up Supabase environment variables.');
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    
    try {
      console.log('Creating account for:', email);
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Registration error:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error(error.message);
        return;
      }
      
      if (data.user) {
        console.log('Auth created for:', data.user.email);
        
        // Create profile in database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: name,
            email: email,
            is_admin: false, // Default to regular user
            created_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          dispatch({ type: 'SET_ERROR', payload: profileError.message });
          toast.error('Error creating user profile');
          return;
        }
        
        console.log('Profile created for:', email);
        
        const user: User = {
          id: data.user.id,
          email: email,
          name: name,
          isAdmin: false
        };
        
        dispatch({ type: 'SET_USER', payload: user });
        toast.success('Account created successfully!');
      } else {
        console.error('No user returned after signup');
        toast.error('Registration failed');
      }
    } catch (error) {
      console.error('Registration exception:', error);
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        toast.error(error.message);
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'An unknown error occurred' });
        toast.error('An unknown error occurred during registration');
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Cart functions
  const addToCart = (product: Product, quantity: number) => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity } 
    });
  };

  const updateCartItem = (productId: string, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_CART_ITEM', 
      payload: { productId, quantity } 
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Order functions
  const createOrder = () => {
    if (state.cart.length === 0 || !state.currentUser) return;
    
    const totalAmount = state.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 
      0
    );
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: state.currentUser.id,
      items: [...state.cart],
      totalAmount,
      status: 'pending',
      createdAt: new Date()
    };
    
    dispatch({ type: 'CREATE_ORDER', payload: newOrder });
  };

  // Product functions
  const getProductsByCategory = (category: string): Product[] => {
    if (category === 'all') return state.products;
    return state.products.filter(p => p.category === category);
  };

  const getProductById = (id: string): Product | undefined => {
    return state.products.find(p => p.id === id);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: `product-${Date.now()}`
    };
    
    dispatch({ 
      type: 'SET_PRODUCTS', 
      payload: [...state.products, newProduct] 
    });
  };

  const updateProduct = (product: Product) => {
    dispatch({
      type: 'SET_PRODUCTS',
      payload: state.products.map(p => 
        p.id === product.id ? product : p
      )
    });
  };

  const deleteProduct = (productId: string) => {
    dispatch({
      type: 'SET_PRODUCTS',
      payload: state.products.filter(p => p.id !== productId)
    });
  };

  const value = {
    state,
    login,
    logout,
    register,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    getProductsByCategory,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

// Custom hook
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
