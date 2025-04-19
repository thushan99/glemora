import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import ProductPage from "./pages/ProductsPage";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserSettings';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';

function App() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/virtual-try-on" element={<VirtualTryOn/>} />
                        <Route path="/products" element={<ProductPage/>} />
                        <Route path="/product/:id" element={<ProductDetail/>} />
                        <Route path="/cart" element={<Cart/>} />
                        <Route path="/checkout" element={<Checkout/>} />
                        <Route path="/order-success" element={<OrderSuccess/>} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />

                        {/* Protected routes */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <UserProfile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <UserSettings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <OrderManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <UserManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <ProductManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['user']}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect root to home page */}
                        <Route path="/" element={<Navigate to="/home" replace />}/>

                        {/* Catch-all route */}
                        <Route path="*" element={<NotFound />}/>
                    </Routes>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;
