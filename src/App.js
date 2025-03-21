import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/navigation/Navigation";
import Footer from "./components/navigation/Footer";
import Home from "./pages/Home";
import VirtualTryOn from "./pages/VirtualTryOn";
import ProductManagement from "./pages/ProductManagement";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/virtual-try-on" element={<VirtualTryOn />} />
                        <Route path="/products" element={<ProductManagement />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        
                        {/* Protected routes for logged-in users */}
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Admin-only routes */}
                        <Route 
                            path="/admin/users" 
                            element={
                                <AdminRoute>
                                    <UserManagement />
                                </AdminRoute>
                            } 
                        />
                        <Route 
                            path="/admin/orders" 
                            element={
                                <AdminRoute>
                                    <OrderManagement />
                                </AdminRoute>
                            } 
                        />
                        
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;