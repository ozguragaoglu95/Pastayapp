import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RequestsProvider } from "@/contexts/RequestsContext";
import { OrdersProvider } from "@/contexts/OrdersContext";

// Layouts
import CustomerLayout from "@/components/layout/CustomerLayout";
import VendorLayout from "@/components/layout/VendorLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Customer pages
import HomePage from "@/pages/HomePage";
import TemplatesPage from "@/pages/TemplatesPage";
import TemplateDetailPage from "@/pages/TemplateDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import DesignWizardPage from "@/pages/DesignWizardPage";
import RequestsPage from "@/pages/RequestsPage";
import RequestDetailPage from "@/pages/RequestDetailPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import ProfilePage from "@/pages/ProfilePage";
import AboutPage from "@/pages/AboutPage";
import FAQPage from "@/pages/FAQPage";
import VendorStorePage from "@/pages/VendorStorePage";

// Vendor pages
import VendorOnboardingPage from "@/pages/vendor/VendorOnboardingPage";
import VendorDashboardPage from "@/pages/vendor/VendorDashboardPage";
import VendorRequestDetailPage from "@/pages/vendor/VendorRequestDetailPage";
import VendorOrdersPage from "@/pages/vendor/VendorOrdersPage";
import VendorFinancePage from "@/pages/vendor/VendorFinancePage";
import VendorProductsPage from "@/pages/vendor/VendorProductsPage";
import VendorAddProductPage from "@/pages/vendor/VendorAddProductPage";
import VendorSettingsPage from "@/pages/vendor/VendorSettingsPage";

// Admin pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <CartProvider>
                <RequestsProvider>
                    <OrdersProvider>
                        <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                                <Routes>
                                    {/* Public Auth Routes */}
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/admin/login" element={<AdminLoginPage />} />
                                    <Route path="/pastane/kayit" element={<VendorOnboardingPage />} />

                                    {/* Customer Routes (Some public, some protected) */}
                                    <Route element={<CustomerLayout />}>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/sablonlar" element={<TemplatesPage />} />
                                        <Route path="/sablonlar/:id" element={<TemplateDetailPage />} />
                                        <Route path="/tasarla" element={<DesignWizardPage />} />
                                        <Route path="/magaza/:id" element={<VendorStorePage />} />

                                        {/* Protected Customer Routes */}
                                        <Route path="/sepet" element={<CartPage />} />
                                        <Route path="/odeme" element={<CheckoutPage />} />
                                        <Route path="/taleplerim" element={
                                            <ProtectedRoute allowedRoles={['customer']}>
                                                <RequestsPage />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/taleplerim/:id" element={
                                            <ProtectedRoute allowedRoles={['customer']}>
                                                <RequestDetailPage />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/siparis/:id" element={
                                            <ProtectedRoute allowedRoles={['customer', 'vendor', 'admin']}>
                                                <OrderTrackingPage />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/profil" element={
                                            <ProtectedRoute allowedRoles={['customer']}>
                                                <ProfilePage />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/hakkimizda" element={<AboutPage />} />
                                        <Route path="/sss" element={<FAQPage />} />
                                    </Route>

                                    {/* Protected Vendor Routes */}
                                    <Route path="/pastane" element={
                                        <ProtectedRoute allowedRoles={['vendor']}>
                                            <VendorLayout />
                                        </ProtectedRoute>
                                    }>
                                        <Route index element={<Navigate to="/pastane/panel" replace />} />
                                        <Route path="panel" element={<VendorDashboardPage />} />
                                        <Route path="talep/:id" element={<VendorRequestDetailPage />} />
                                        <Route path="siparisler" element={<VendorOrdersPage />} />
                                        <Route path="finans" element={<VendorFinancePage />} />
                                        <Route path="urunler" element={<VendorProductsPage />} />
                                        <Route path="urun-ekle" element={<VendorAddProductPage />} />
                                        <Route path="ayarlar" element={<VendorSettingsPage />} />
                                    </Route>

                                    {/* Protected Admin Routes */}
                                    <Route path="/admin" element={
                                        <ProtectedRoute allowedRoles={['admin']}>
                                            <AdminLayout />
                                        </ProtectedRoute>
                                    }>
                                        <Route index element={<AdminDashboardPage />} />
                                    </Route>

                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </BrowserRouter>
                        </TooltipProvider>
                    </OrdersProvider>
                </RequestsProvider>
            </CartProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
