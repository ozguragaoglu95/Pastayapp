import { useParams, Link } from "react-router-dom";
import { mockVendors, mockTemplates } from "@/data/mock-data";
import { Star, MapPin, Clock, ShoppingBag, ChevronRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotFound from "./NotFound";

export default function VendorStorePage() {
    const { id } = useParams();
    const vendor = mockVendors.find(v => v.id === id);
    const products = mockTemplates.filter(t => t.vendorId === id);

    if (!vendor) return <NotFound />;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header Banner */}
            <div className="h-48 md:h-64 bg-slate-900 relative overflow-hidden">
                <img
                    src={vendor.portfolio[0] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200"}
                    className="w-full h-full object-cover opacity-40"
                    alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Vendor Info Card */}
                        <Card className="rounded-[2.5rem] border-0 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="h-24 w-24 rounded-3xl border-4 border-white shadow-lg overflow-hidden shrink-0">
                                        <img src={vendor.portfolio[1] || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=200"} alt={vendor.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-3xl font-black font-display text-slate-900">{vendor.name}</h1>
                                            <div className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg shadow-yellow-400/20">
                                                <Star className="h-4 w-4 fill-white" />
                                                <span>{vendor.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                {vendor.city}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
                                                <Clock className="h-4 w-4 text-primary" />
                                                Min. {vendor.minLeadTimeDays} Gün Önceden Sipariş
                                            </div>
                                        </div>
                                        <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
                                            Hakkında: {vendor.name} olarak her kutlamanız için en taze ve kreatif tasarımları hazırlıyoruz. Sadece en kaliteli malzemelerle, size özel rüya pastalar...
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Products Tabs */}
                        <Tabs defaultValue="all" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <TabsList className="bg-transparent border-b border-slate-200 rounded-none h-auto p-0 gap-8">
                                    <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-500 data-[state=active]:text-primary pb-3 text-lg transition-all">Tüm Ürünler ({products.length})</TabsTrigger>
                                    <TabsTrigger value="portfolio" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-500 data-[state=active]:text-primary pb-3 text-lg transition-all">Portfolyo</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="all" className="mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <Link key={product.id} to={`/tasarimlar/${product.id}`} className="group">
                                            <Card className="rounded-[2rem] overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all h-full bg-white">
                                                <div className="aspect-[4/5] relative overflow-hidden">
                                                    <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={product.name} />
                                                    <div className="absolute top-4 left-4">
                                                        <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-0 rounded-xl px-3 py-1 shadow-sm font-bold">{product.category}</Badge>
                                                    </div>
                                                </div>
                                                <CardContent className="p-6 space-y-3">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                                        <div className="flex items-center gap-1 font-bold text-yellow-500 text-sm">
                                                            <Star className="h-3 w-3 fill-yellow-500" />
                                                            {product.rating}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2">
                                                        <span className="text-xl font-black text-slate-900">{product.basePrice} ₺</span>
                                                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary"><ChevronRight className="h-5 w-5" /></Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="portfolio" className="mt-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {vendor.portfolio.map((img, idx) => (
                                        <div key={idx} className="aspect-square rounded-[1.5rem] overflow-hidden shadow-sm hover:scale-105 transition-transform">
                                            <img src={img} className="w-full h-full object-cover" alt={`Work ${idx}`} />
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="md:w-80 space-y-6">
                        <Card className="rounded-[2.5rem] border-2 border-slate-100 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-3 text-slate-900 font-black tracking-tight">
                                <Info className="h-5 w-5 text-primary" /> Teslimat Bilgileri
                            </div>
                            <div className="space-y-4 pt-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hizmet Bölgesi</span>
                                    <span className="text-sm font-bold text-slate-700">{vendor.city} Genelinde</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Çalışma Saatleri</span>
                                    <span className="text-sm font-bold text-slate-700">09:00 - 20:00 (PZT-CMT)</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
