import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter, MoreHorizontal, Package, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/contexts/OrdersContext";
import { getTemplateById, formatPrice } from "@/data/mock-data";
import { useRequests } from "@/contexts/RequestsContext";

const STATUS_Styles: Record<string, string> = {
    confirmed: "bg-blue-500/10 text-blue-600 border-blue-200",
    in_progress: "bg-orange-500/10 text-orange-600 border-orange-200",
    ready: "bg-green-500/10 text-green-600 border-green-200",
    delivered: "bg-gray-500/10 text-gray-600 border-gray-200",
    cancelled: "bg-red-500/10 text-red-600 border-red-200",
};

export default function VendorOrdersPage() {
    const { orders } = useOrders();
    const { getRequestById } = useRequests();

    // Filter for current vendor (mock: vendor-1)
    const vendorOrders = orders.filter(o => o.vendorId === 'vendor-1');

    return (
        <div className="flex flex-col gap-6 container mx-auto p-6 max-w-6xl pb-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold">Siparişler</h1>
                    <p className="text-sm text-muted-foreground">Gelen siparişlerinizi yönetin ve durumlarını güncelleyin.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/pastane/panel">Panele Dön</Link>
                    </Button>
                    <Button size="sm">Yeni Sipariş Ekle</Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center bg-card p-3 rounded-xl border">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Sipariş no, müşteri adı..." className="pl-9 h-9" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <Button variant="outline" size="sm" className="h-9 gap-1.5 dashed">
                        <Filter className="h-3.5 w-3.5" /> Filtrele
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-1.5 dashed">
                        Durum
                    </Button>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {vendorOrders.length > 0 ? (
                    vendorOrders.map((order) => {
                        // Resolve product name (Template or Custom Request)
                        let productName = "Özel Talep";
                        let productImage = null;

                        if (order.templateProductId) {
                            const tmpl = getTemplateById(order.templateProductId);
                            if (tmpl) {
                                productName = tmpl.name;
                                productImage = tmpl.image;
                            }
                        } else if (order.requestId) {
                            const req = getRequestById(order.requestId);
                            if (req) {
                                productName = `${req.spec.flavor} / ${req.spec.filling} (${req.spec.occasion})`;
                                productImage = req.conceptImage;
                            }
                        }

                        return (
                            <div key={order.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-all">
                                <div className="flex flex-1 items-start gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-secondary overflow-hidden shrink-0">
                                        {productImage ? (
                                            <img src={productImage} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                                            <Badge variant="outline" className={`text-[10px] h-5 border-0 ${STATUS_Styles[order.status] || "bg-secondary"}`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <h3 className="font-semibold line-clamp-1">{productName}</h3>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
                                            {order.deliveryAddress && (
                                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.deliveryAddress}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto pt-3 md:pt-0 border-t md:border-0 pl-3">
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{formatPrice(order.totalPrice)}</p>
                                        <p className="text-xs text-muted-foreground">Komisyon: {formatPrice(order.commission)}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <h3 className="font-semibold text-lg">Sipariş Bulunamadı</h3>
                        <p className="text-muted-foreground text-sm">Henüz bir sipariş almadınız.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
