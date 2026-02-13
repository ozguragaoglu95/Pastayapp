import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    MessageSquare,
    Store,
    Plus,
    ChevronRight,
    Search,
    Star,
    TrendingUp,
    Gift,
    Package,
    Settings,
    LogOut,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRequests } from "@/contexts/RequestsContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockTemplates } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DashboardTab = 'marketplace' | 'special_requests' | 'orders' | 'products';

export default function VendorDashboardPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { requests } = useRequests();
    const { orders } = useOrders();
    const [activeTab, setActiveTab] = useState<DashboardTab>('marketplace');

    // Marketplace: Requests waiting for offers (NO templateId)
    const marketplaceRequests = requests.filter(r => (r.status === 'pending' || r.status === 'waiting_offers') && !r.spec.templateId);

    // Specialized Requests: Requests based on a template
    const specialRequests = requests.filter(r => (r.status === 'pending' || r.status === 'waiting_offers' || r.status === 'offers_received') && !!r.spec.templateId);

    // Active Orders: Paid but not delivered
    const activeOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'in_progress' || o.status === 'ready');

    // Change Request check
    const hasAnyChangeRequest = activeOrders.some(o => o.hasChangeRequest);

    // Products
    const vendorProducts = mockTemplates.filter(t => t.vendorId === 'v1');
    const topProducts = [...vendorProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

    return (
        <div className="flex flex-col gap-8 pb-32 container mx-auto p-4 md:p-8 max-w-6xl">
            {/* Profile Header Area */}
            <div className="flex flex-col items-center justify-center py-6 gap-4 relative">
                {/* Restaurant Rating */}
                <div className="absolute top-0 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-yellow-400/20">
                        <Star className="h-3 w-3 fill-white" />
                        <span>4.9</span>
                    </div>
                </div>

                {/* Profile Button / Avatar */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-24 w-24 rounded-full border-4 border-white shadow-2xl overflow-hidden hover:scale-105 transition-transform active:scale-95 group relative">
                            <img
                                src={user?.avatar || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200"}
                                alt="Store"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Settings className="text-white h-6 w-6" />
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56 rounded-2xl p-2">
                        <DropdownMenuLabel>Mağaza Ayarları</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/pastane/ayarlar")} className="rounded-xl cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profili Düzenle</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Çıkış Yap</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Vendor Info Bar */}
                <div className="text-center">
                    <h1 className="font-display text-2xl font-black text-slate-900 capitalize">{user?.name || "Şeker Atölyesi"}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Sipariş</span>
                            <span className="text-lg font-black text-slate-900">128</span>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-200" />
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Puanlanan</span>
                            <span className="text-lg font-black text-slate-900">112</span>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-200" />
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Yorum</span>
                            <span className="text-lg font-black text-slate-900">84</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Marketplace Card */}
                <button
                    onClick={() => setActiveTab('marketplace')}
                    className={`relative group h-32 rounded-[2rem] transition-all p-5 text-left border-2 flex flex-col justify-between overflow-hidden ${activeTab === 'marketplace' ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-white bg-white hover:border-slate-200"
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-xl ${activeTab === 'marketplace' ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Search className="h-5 w-5" />
                        </div>
                        {marketplaceRequests.length > 0 && (
                            <div className="bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                                {marketplaceRequests.length}
                            </div>
                        )}
                    </div>
                    <span className={`font-black text-sm md:text-md ${activeTab === 'marketplace' ? "text-primary" : "text-slate-700"}`}>Pazar Yeri</span>
                </button>

                {/* Specialized Requests Card (Talepler) */}
                <button
                    onClick={() => setActiveTab('special_requests')}
                    className={`relative group h-32 rounded-[2rem] transition-all p-5 text-left border-2 flex flex-col justify-between overflow-hidden ${activeTab === 'special_requests' ? "border- cake-gold bg-cake-gold/5 ring-4 ring-cake-gold/5" : "border-white bg-white hover:border-slate-200"
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-xl ${activeTab === 'special_requests' ? "bg-cake-gold text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Gift className="h-5 w-5" />
                        </div>
                        {specialRequests.length > 0 && (
                            <div className="bg-cake-gold text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                                {specialRequests.length}
                            </div>
                        )}
                    </div>
                    <span className={`font-black text-sm md:text-md ${activeTab === 'special_requests' ? "text-cake-gold" : "text-slate-700"}`}>Talepler</span>
                </button>

                {/* Active Orders Card */}
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`relative group h-32 rounded-[2rem] transition-all p-5 text-left border-2 flex flex-col justify-between overflow-hidden ${activeTab === 'orders' ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-500/5" : "border-white bg-white hover:border-slate-200"
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-xl w-fit ${activeTab === 'orders' ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Package className="h-5 w-5" />
                        </div>
                        <div className={`bg-orange-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${hasAnyChangeRequest ? 'animate-spin-slow' : ''}`}>
                            {activeOrders.length}
                        </div>
                    </div>
                    <span className={`font-black text-sm md:text-md ${activeTab === 'orders' ? "text-orange-600" : "text-slate-700"}`}>Aktif Sipariş</span>
                </button>

                {/* Products Card */}
                <button
                    onClick={() => setActiveTab('products')}
                    onDoubleClick={() => navigate("/pastane/urunler")}
                    className={`relative group h-32 rounded-[2rem] transition-all p-5 text-left border-2 flex flex-col justify-between overflow-hidden ${activeTab === 'products' ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-white bg-white hover:border-slate-200"
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-xl w-fit ${activeTab === 'products' ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}>
                            <Store className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`font-black text-sm md:text-md ${activeTab === 'products' ? "text-primary" : "text-slate-700"}`}>Ürünlerim</span>
                        <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </button>
            </div>

            {/* Dynamic Slider Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900">
                        {activeTab === 'marketplace' && "Genel İstekler (Pazar Yeri)"}
                        {activeTab === 'special_requests' && "Size Özel Talepler (Ürün Üzerinden)"}
                        {activeTab === 'orders' && "Güncel İşler"}
                        {activeTab === 'products' && "En Çok Satan Ürünlerin"}
                    </h2>
                    <Link
                        to={activeTab === 'marketplace' ? "/pastane/panel" : activeTab === 'special_requests' ? "/pastane/talep" : activeTab === 'orders' ? "/pastane/siparisler" : "/pastane/urunler"}
                        className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                    >
                        Tümünü Yönet <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto no-scrollbar pb-4 -mx-2">
                    <div className="flex gap-4 px-2 min-h-[200px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex gap-4"
                            >
                                {activeTab === 'marketplace' && (
                                    marketplaceRequests.length > 0 ? (
                                        marketplaceRequests.map(req => (
                                            <Card key={req.id} className="min-w-[280px] rounded-3xl border-0 shadow-sm bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate(`/pastane/talep/${req.id}`)}>
                                                <CardContent className="p-5 flex flex-col justify-between h-full">
                                                    <div className="space-y-3">
                                                        <Badge className="bg-primary/10 text-primary border-0 rounded-lg capitalize">{req.spec.occasion.replace("_", " ")}</Badge>
                                                        <h3 className="font-bold text-slate-900 line-clamp-2">{req.spec.notes || "Özel Tasarım İstek"}</h3>
                                                        <p className="text-xs text-slate-500 font-medium">{req.spec.portions} Kişilik</p>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString("tr-TR")}</span>
                                                        <span className="text-primary font-bold text-sm">Teklif Ver</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : <div className="text-slate-400 italic py-10">Henüz yeni bir genel talep bulunmuyor.</div>
                                )}

                                {activeTab === 'special_requests' && (
                                    specialRequests.length > 0 ? (
                                        specialRequests.map(req => (
                                            <Card key={req.id} className="min-w-[280px] rounded-3xl border-0 shadow-sm bg-cake-gold/5 hover:bg-cake-gold/10 transition-colors cursor-pointer border-l-4 border-cake-gold" onClick={() => navigate(`/pastane/talep/${req.id}`)}>
                                                <CardContent className="p-5 flex flex-col justify-between h-full">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <Badge className="bg-cake-gold text-white border-0 rounded-lg">Şablon Üzerinden</Badge>
                                                            <span className="text-[10px] font-black text-cake-gold px-2 py-0.5 bg-cake-gold/10 rounded-full">Tasarla 🎂</span>
                                                        </div>
                                                        <h3 className="font-bold text-slate-900 line-clamp-1">{req.spec.occasion.replace("_", " ")} - {req.spec.portions} Kişilik</h3>
                                                        <p className="text-xs text-slate-500 font-medium line-clamp-2">{req.spec.notes || "Kullanıcı bir şablonu özelleştirerek talep oluşturdu."}</p>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString("tr-TR")}</span>
                                                        <span className="text-cake-gold font-bold text-sm">Detayları Gör</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : <div className="text-slate-400 italic py-10">Ürünlerinize gelen özel bir talep bulunmuyor.</div>
                                )}

                                {activeTab === 'orders' && (
                                    activeOrders.length > 0 ? (
                                        activeOrders.map(order => (
                                            <Card key={order.id} className="min-w-[280px] rounded-3xl border-0 shadow-sm bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group" onClick={() => navigate(`/siparis/${order.id}`)}>
                                                <CardContent className="p-5 flex flex-col justify-between h-full">
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sipariş: #{order.id.slice(-4)}</p>
                                                            <h3 className="font-bold text-slate-900">Müşteri Siparişi</h3>
                                                        </div>
                                                        <Badge className={`rounded-full ${order.hasChangeRequest ? 'bg-orange-500 animate-pulse' : ''}`}>
                                                            {order.hasChangeRequest ? 'Değişiklik İstendi' : order.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-4 flex items-center gap-3 bg-white p-3 rounded-2xl group-hover:bg-primary/5 transition-colors">
                                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                            <ShoppingBag className="h-5 w-5" />
                                                        </div>
                                                        <p className="text-lg font-black text-slate-900">{order.totalPrice} ₺</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : <div className="text-slate-400 italic py-10">Aktif sipariş bulunmuyor.</div>
                                )}

                                {activeTab === 'products' && (
                                    topProducts.map(product => (
                                        <Card key={product.id} className="min-w-[220px] rounded-3xl overflow-hidden border-0 shadow-sm group">
                                            <div className="aspect-square relative overflow-hidden">
                                                <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-[10px] font-bold text-slate-700">{product.rating}</span>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 bg-slate-50">
                                                <h3 className="font-bold text-sm truncate text-slate-900">{product.name}</h3>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-primary font-black">{product.basePrice} ₺</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">{product.reviewCount} Satış</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Add Product Section (Bottom) */}
            <div className="mt-4">
                <button
                    onClick={() => navigate("/pastane/urun-ekle")}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] group shadow-xl shadow-slate-200"
                >
                    <div className="h-16 w-16 rounded-3xl bg-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12">
                        <Plus className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-black tracking-tight">Ürün Ekle</h3>
                        <p className="text-slate-400 font-medium">Yeni bir şablon ekleyerek satışlarını artır</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
