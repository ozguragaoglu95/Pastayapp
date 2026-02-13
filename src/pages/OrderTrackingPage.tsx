import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Package, MapPin, Truck, MessageSquare, Phone, Clock, ChefHat, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock order data
const MOCK_ORDER = {
    id: "ord-123",
    status: "in_progress",
    vendorName: "Tatlı Rüyalar Atölyesi",
    vendorPhone: "+90 555 123 45 67",
    productName: "Orman Meyveli Rüya",
    totalPrice: 1600,
    orderDate: "2024-02-10T14:30:00",
    deliveryDate: "2024-02-14",
    currentStep: 2, // 1 to 4
    steps: [
        { id: 1, status: "confirmed", label: "Onaylandı", icon: CheckCircle2, completed: true, date: "10 Şub 14:35" },
        { id: 2, status: "in_progress", label: "Hazırlanıyor", icon: ChefHat, completed: true, date: "11 Şub 09:00" },
        { id: 3, status: "ready", label: "Yolda", icon: Truck, completed: false, date: null },
        { id: 4, status: "delivered", label: "Teslim Edildi", icon: Package, completed: false, date: null },
    ]
};

export default function OrderTrackingPage() {
    const navigate = useNavigate();
    const order = MOCK_ORDER;

    const progressValue = (order.currentStep / order.steps.length) * 100;

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-slate-50/50">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-200">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <h1 className="font-display text-lg font-bold">Sipariş Takibi</h1>
                    <p className="text-[10px] text-muted-foreground">Sipariş: #{order.id}</p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {order.steps[order.currentStep - 1].label}
                </Badge>
            </div>

            <div className="p-4 space-y-6 max-w-2xl mx-auto w-full">
                {/* Visual Progress Bar */}
                <Card className="border-0 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center mb-4">
                            {order.steps.map((step) => {
                                const Icon = step.icon;
                                const isActive = step.id <= order.currentStep;
                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive
                                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                : "bg-white border-slate-200 text-slate-400"
                                            }`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-slate-400"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                            {/* Connector Line behind steps */}
                            <div className="absolute top-[52px] left-10 right-10 h-0.5 bg-slate-100 -z-0">
                                <div
                                    className="h-full bg-primary transition-all duration-1000 ease-out"
                                    style={{ width: `${((order.currentStep - 1) / (order.steps.length - 1)) * 100}%` }}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center pt-2">
                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                            <h2 className="text-sm font-semibold text-slate-700">Tahmini Teslimat</h2>
                            <p className="text-2xl font-display font-bold text-primary">14 Şubat, Çarşamba</p>
                            <p className="text-[11px] text-muted-foreground mt-1">Siparişiniz sevgiyle hazırlanıyor...</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline & Activity */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm">Sipariş Hareketleri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0">
                        {order.steps.slice().reverse().map((step, idx) => (
                            <div key={idx} className="relative pb-6 last:pb-0 pl-6 border-l-2 border-slate-100 ml-2">
                                <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white ${step.completed ? "bg-primary" : "bg-slate-200"
                                    }`} />
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-medium ${step.completed ? "text-slate-900" : "text-slate-400"}`}>
                                            {step.label}
                                        </span>
                                        <p className="text-[10px] text-muted-foreground">
                                            {step.id === 2 ? "Şefimiz pastanızı süslüyor." : step.completed ? "İşlem başarıyla tamamlandı." : "Henüz bu aşamaya gelinmedi."}
                                        </p>
                                    </div>
                                    {step.date && (
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                            {step.date}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Order Summary Card */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm">Sipariş Özeti</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop"
                                    alt={order.productName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{order.productName}</p>
                                <p className="text-xs text-muted-foreground">{order.vendorName}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs font-semibold text-primary">₺{order.totalPrice}</span>
                                    <span className="text-[10px] text-slate-400">Adet: 1</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="grid gap-3">
                            <div className="flex gap-3 items-start">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-700">Teslimat Adresi</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Bağdat Caddesi, No:123, Kadıköy, İstanbul
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="outline" size="sm" className="gap-2 h-9 border-slate-200">
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Satıcıya Yaz</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 h-9 border-slate-200">
                                <Phone className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Destek Al</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
