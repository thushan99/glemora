import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem("user");
    const savedCart = localStorage.getItem("cart");
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAdmin(user.role === "admin");
    }
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Authentication functions
  function login(email, password) {
    // This is where you would typically connect to your backend
    // For now, we'll simulate a successful login with mock data
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Mock user data - in a real app, this would come from your backend
        if (email === "admin@example.com" && password === "123") {
          const user = { 
            id: "1", 
            email, 
            name: "Admin User", 
            role: "admin" 
          };
          setCurrentUser(user);
          setIsAdmin(true);
          localStorage.setItem("user", JSON.stringify(user));
          resolve(user);
        } else if (email && password) {
          // Regular user login
          const user = { 
            id: "2", 
            email, 
            name: "Regular User", 
            role: "user" 
          };
          setCurrentUser(user);
          setIsAdmin(false);
          localStorage.setItem("user", JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  }

  function register(name, email, password) {
    // Simulate registration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = { 
          id: Math.random().toString(36).substr(2, 9), 
          email, 
          name, 
          role: "user" 
        };
        setCurrentUser(user);
        setIsAdmin(false);
        localStorage.setItem("user", JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  }

  function logout() {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem("user");
    // We keep the cart in localStorage
  }

  // Cart functions
  function addToCart(product, quantity = 1) {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity }];
      }
    });
  }

  function removeFromCart(productId) {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }

  function updateCartItemQuantity(productId, quantity) {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: quantity } 
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");
  }

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Auth context value
  const value = {
    currentUser,
    isAdmin,
    loading,
    login,
    register,
    logout,
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
}