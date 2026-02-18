import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, ShoppingBag, Calendar } from "lucide-react";
import { formatPrice } from "@/data/mock-data";
import { useOrders } from "@/contexts/OrdersContext";

export default function VendorFinancePage() {
    const { orders } = useOrders();
    const [dateRange, setDateRange] = useState("this_month");

    const vendorId = 'v1';

    // Calculate date ranges
    const now = new Date();
    const getDateRange = (range: string) => {
        const start = new Date();
        const end = new Date();

        switch (range) {
            case "this_month":
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                break;
            case "last_month":
                start.setMonth(start.getMonth() - 1);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setDate(0); // Last day of previous month
                end.setHours(23, 59, 59, 999);
                break;
            case "last_3_months":
                start.setMonth(start.getMonth() - 3);
                start.setHours(0, 0, 0, 0);
                break;
            case "this_year":
                start.setMonth(0);
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                break;
            default:
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
        }

        return { start, end };
    };

    const { start, end } = getDateRange(dateRange);

    // Filter orders by date range and vendor
    const filteredOrders = orders.filter(o => {
        if (o.vendorId !== vendorId) return false;
        const orderDate = new Date(o.createdAt);
        return orderDate >= start && orderDate <= end;
    });

    // Calculate metrics
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalCommission = filteredOrders.reduce((sum, o) => sum + o.commission, 0);
    const netRevenue = totalRevenue - totalCommission;
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;
    const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length;
    const returnedOrders = filteredOrders.filter(o => o.status === 'returned').length;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-display">Finansal Özet</h1>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this_month">Bu Ay</SelectItem>
                            <SelectItem value="last_month">Geçen Ay</SelectItem>
                            <SelectItem value="last_3_months">Son 3 Ay</SelectItem>
                            <SelectItem value="this_year">Bu Yıl</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-[2rem] border-2 border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Net Gelir</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatPrice(netRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{totalOrders} sipariş</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-2 border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatPrice(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Komisyon: {formatPrice(totalCommission)}</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-2 border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {completedOrders} tamamlandı
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Status Breakdown */}
            <Card className="rounded-[2rem] border-2 border-slate-100">
                <CardHeader>
                    <CardTitle>Sipariş Durumu Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-green-50 border-2 border-green-100">
                            <p className="text-sm font-medium text-green-600">Tamamlanan</p>
                            <p className="text-2xl font-bold text-green-700">{completedOrders}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-100">
                            <p className="text-sm font-medium text-orange-600">Aktif</p>
                            <p className="text-2xl font-bold text-orange-700">
                                {filteredOrders.filter(o => ['confirmed', 'preparing', 'in_progress', 'ready'].includes(o.status)).length}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-100">
                            <p className="text-sm font-medium text-purple-600">İade</p>
                            <p className="text-2xl font-bold text-purple-700">{returnedOrders}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-100">
                            <p className="text-sm font-medium text-red-600">İptal</p>
                            <p className="text-2xl font-bold text-red-700">{cancelledOrders}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="rounded-[2rem] border-2 border-slate-100">
                <CardHeader>
                    <CardTitle>Son İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredOrders.slice(0, 10).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border-2 border-slate-100 hover:border-primary/20 transition-colors">
                                <div>
                                    <p className="font-bold text-sm">#{order.id}</p>
                                    <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">{formatPrice(order.totalPrice)}</p>
                                    <p className="text-xs text-slate-500">Komisyon: {formatPrice(order.commission)}</p>
                                </div>
                            </div>
                        ))}
                        {filteredOrders.length === 0 && (
                            <p className="text-center text-slate-400 italic py-8">Bu tarih aralığında sipariş bulunamadı.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
