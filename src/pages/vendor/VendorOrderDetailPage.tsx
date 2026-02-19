import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    MessageSquare,
    Clock,
    ChefHat,
    Truck,
    CheckCircle2,
    Package,
    MapPin,
    User,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/contexts/OrdersContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/mock-data";
import { OrderStatus } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const STATUS_LABELS: Record<OrderStatus, string> = {
    confirmed: "Kabul Edildi",
    preparing: "Hazırlanıyor",
    in_progress: "Hazırlanıyor",
    ready: "Hazır",
    shipped: "Yolda",
    delivered: "Teslim Edildi",
    completed: "Tamamlandı",
    returned: "İade Edildi",
    cancelled: "İptal Edildi"
};

export default function VendorOrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { orders, updateOrderStatus } = useOrders();
    const { user } = useAuth();

    const order = orders.find(o => o.id === id);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'confirmed');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveStatus = useCallback(() => {
        if (!order) return;
        setIsSaving(true);
        // Simulate API delay
        setTimeout(() => {
            updateOrderStatus(order.id, selectedStatus);
            setIsSaving(false);
            toast.success("Sipariş durumu güncellendi");
        }, 500);
    }, [order, selectedStatus, updateOrderStatus]);

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-muted-foreground">Sipariş bulunamadı.</p>
                <Button onClick={() => navigate("/pastane/siparisler")}>Siparişlere Dön</Button>
            </div>
        );
    }

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
                    <h1 className="font-display text-lg font-bold">Sipariş Detayı</h1>
                    <p className="text-[10px] text-muted-foreground tracking-widest uppercase">#{order.id}</p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-lg">
                    {STATUS_LABELS[order.status]}
                </Badge>
            </div>

            <div className="p-4 space-y-6 max-w-4xl mx-auto w-full">
                {/* Status Management Card */}
                <Card className="border-0 shadow-sm overflow-hidden bg-slate-900 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-400">Sipariş Durumunu Yönet</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-xs font-bold text-slate-500">Mevcut Aşama</label>
                                <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as OrderStatus)}>
                                    <SelectTrigger className="bg-white/10 border-white/10 text-white h-12 rounded-xl focus:ring-primary">
                                        <SelectValue placeholder="Durum Seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="confirmed">Kabul Edildi</SelectItem>
                                        <SelectItem value="preparing">Hazırlanıyor</SelectItem>
                                        <SelectItem value="completed">Tamamlandı (Teslimata Hazır)</SelectItem>
                                        <SelectItem value="shipped">Yola Çıkar (Kuryede)</SelectItem>
                                        <SelectItem value="delivered">Teslim Edildi</SelectItem>
                                        <SelectItem value="returned">İade</SelectItem>
                                        <SelectItem value="cancelled">İptal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                className="w-full md:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-xl gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                onClick={handleSaveStatus}
                                disabled={isSaving || selectedStatus === order.status}
                            >
                                <Save className="h-4 w-4" />
                                {isSaving ? "Kaydediliyor..." : "Durumu Kaydet"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Order Details */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-black">Ürün ve Müşteri Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-slate-50">
                                        <img
                                            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop"
                                            alt="Ürün"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 py-1">
                                        <h3 className="font-black text-slate-900">Özel Tasarım Pasta</h3>
                                        <p className="text-xs text-muted-foreground mt-1">10-15 Kişilik • Çikolatalı • Frambuazlı</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-sm font-black text-primary">{formatPrice(order.totalPrice)}</span>
                                            <Badge variant="outline" className="text-[10px] rounded-md py-0 h-5">Adet: 1</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100" />

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                            <User className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Müşteri</p>
                                            <p className="text-sm font-bold text-slate-900">Müşteri #{order.userId.slice(-4)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                            <MapPin className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Teslimat Adresi</p>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                {order.deliveryAddress || "Adres bilgisi girilmemiş"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 gap-2 border-2 border-slate-100 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all font-bold rounded-xl"
                                        onClick={() => navigate(`/pastane/talep/${order.requestId || order.id}`)} // Simplified routing to chat
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        Müşteriye Yaz
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order History Timeline */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-black">Sipariş Geçmişi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {order.statusHistory.slice().reverse().map((history, idx) => (
                                    <div key={idx} className="relative pb-6 last:pb-0 pl-6 border-l-2 border-slate-100 ml-2">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-primary" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-sm font-bold text-slate-900">
                                                    {STATUS_LABELS[history.status]}
                                                </span>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    Sipariş durumu "{STATUS_LABELS[history.status]}" olarak güncellendi.
                                                </p>
                                            </div>
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">
                                                {new Date(history.timestamp).toLocaleString("tr-TR", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Meta / Summary */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm bg-primary/5 border-l-4 border-primary">
                            <CardHeader>
                                <CardTitle className="text-sm font-black">Tahsilat Detayı</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Ara Toplam</span>
                                    <span className="font-bold">{formatPrice(order.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-red-500">
                                    <span className="font-medium">Komisyon (%10)</span>
                                    <span className="font-bold">-{formatPrice(order.commission)}</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-slate-900">Kazancınız</span>
                                    <span className="text-lg font-black text-primary">{formatPrice(order.totalPrice - order.commission)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-black">Zaman Çizelgesi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Sipariş Tarihi</p>
                                        <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Teslimat Yöntemi</p>
                                        <p className="text-xs font-bold">Adrese Teslimat</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
