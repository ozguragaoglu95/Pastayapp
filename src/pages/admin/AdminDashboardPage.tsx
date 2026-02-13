import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Store,
    Users,
    Package,
    TrendingUp,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    MoreHorizontal,
    ShoppingBag,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { mockVendors, formatPrice } from '@/data/mock-data';
import { useOrders } from '@/contexts/OrdersContext';
import { useRequests } from '@/contexts/RequestsContext';
import { Input } from '@/components/ui/input';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const chartData = [
    { name: 'Oca', orders: 45, revenue: 12000 },
    { name: 'Şub', orders: 52, revenue: 15400 },
    { name: 'Mar', orders: 48, revenue: 13900 },
    { name: 'Nis', orders: 61, revenue: 18200 },
    { name: 'May', orders: 55, revenue: 16800 },
    { name: 'Haz', orders: 67, revenue: 21000 },
];

export default function AdminDashboardPage() {
    const { orders } = useOrders();
    const { requests } = useRequests();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalCommission = orders.reduce((sum, o) => sum + o.commission, 0);

    // Stats
    const stats = [
        {
            icon: Store,
            label: 'Onaylı Pastane',
            value: mockVendors.filter(v => v.approved).length,
            change: "+2 bu ay",
            trend: 'up'
        },
        {
            icon: MessageSquare,
            label: 'Aktif Talepler',
            value: requests.length,
            change: "+12% geçen haftadan",
            trend: 'up'
        },
        {
            icon: ShoppingBag,
            label: 'Toplam Sipariş',
            value: orders.length,
            change: "+24% geçen aydan",
            trend: 'up'
        },
        {
            icon: TrendingUp,
            label: 'Komisyon Geliri',
            value: formatPrice(totalCommission),
            change: "+8% geçen aydan",
            trend: 'up'
        },
    ];

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto pb-20 bg-slate-50/30 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight">Yönetim Paneli</h1>
                    <p className="text-muted-foreground">Platform durumunu ve aktiviteleri buradan yönetebilirsiniz.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Rapor İndir</Button>
                    <Button size="sm">Yeni Duyuru Yayını</Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-0 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {stat.label}
                            </CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center">
                                <stat.icon className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                                )}
                                <p className={`text-[10px] font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-white p-1 border shadow-sm">
                    <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                    <TabsTrigger value="requests">Talepler</TabsTrigger>
                    <TabsTrigger value="orders">Siparişler</TabsTrigger>
                    <TabsTrigger value="vendors">Pastaneler</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Order Statistics Chart */}
                        <Card className="col-span-4 border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Platform Sipariş Trendi</CardTitle>
                                <CardDescription>Aylara göre toplam sipariş sayısı.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                borderRadius: '8px',
                                                border: '1px solid hsl(var(--border))',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }}
                                        />
                                        <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Recent Activity List */}
                        <Card className="col-span-3 border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
                                <CardDescription>Onay bekleyen son başvuru ve talepler.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">İnceleme Bekleyenler</h4>
                                    {mockVendors.filter(v => !v.approved).slice(0, 3).map(vendor => (
                                        <div key={vendor.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group transition-all hover:border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-white border flex items-center justify-center text-[10px] font-bold">
                                                    {vendor.name.charAt(0)}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-semibold leading-none">{vendor.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{vendor.city}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-7 text-[10px] hover:bg-primary/10 hover:text-primary">İncele</Button>
                                        </div>
                                    ))}
                                    <div className="h-px bg-slate-100 my-2" />
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aktif Rakamlar</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                                            <p className="text-[10px] text-primary font-medium">Satıcı Memnuniyeti</p>
                                            <p className="text-lg font-bold">4.8/5.0</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] text-muted-foreground font-medium">Bütçe Durumu</p>
                                            <p className="text-lg font-bold">Sabit</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* سایر تاب‌ها (Requests, Orders, Vendors) با همان منطق قبلی اما استایل بهتر */}
                <TabsContent value="requests" className="space-y-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Müşteri Talepleri</CardTitle>
                                <CardDescription>Platformdaki tüm pasta taleplerini buradan izleyin.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Input placeholder="Talep no veya ilçe..." className="w-[200px] h-9 text-xs" />
                                <Button variant="outline" size="sm" className="h-9">
                                    <Filter className="mr-2 h-3.5 w-3.5" />
                                    Filtrele
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {requests.slice(0, 10).map(req => (
                                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0 gap-4 group transition-colors hover:bg-slate-50/50 p-2 rounded-lg">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">#{req.id}</span>
                                                <Badge variant="secondary" className="text-[10px] h-5 capitalize bg-blue-50 text-blue-700 border-blue-100">
                                                    {req.status.replace("_", " ")}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-semibold capitalize">{req.spec.occasion.replace("_", " ")} Pastası</p>
                                            <p className="text-[11px] text-muted-foreground">{req.spec.district} • {new Date(req.spec.eventDate).toLocaleDateString("tr-TR")}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-bold">{req.offers.length} Teklif</p>
                                                <p className="text-[10px] text-muted-foreground">{new Date(req.createdAt).toLocaleDateString("tr-TR")}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Sipariş Akışı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between border border-slate-100 p-4 rounded-xl transition-all hover:shadow-sm hover:border-primary/10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                                <ShoppingBag className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Sipariş #{order.id}</p>
                                                <p className="text-[11px] text-muted-foreground">{new Date(order.createdAt).toLocaleString("tr-TR")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm font-extrabold text-primary">{formatPrice(order.totalPrice)}</p>
                                                <Badge variant="outline" className="text-[10px] h-5 font-normal">{order.status}</Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* VENDORS TAB */}
                <TabsContent value="vendors">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">İş Ortaklarımız</CardTitle>
                            <CardDescription>Platformda satış yapan aktif pastaneler.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockVendors.map(vendor => (
                                    <div key={vendor.id} className="flex items-center justify-between border border-slate-100 p-4 rounded-xl transition-all hover:bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                                {vendor.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{vendor.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{vendor.city}, {vendor.district}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`text-[9px] h-4 px-1.5 ${vendor.approved ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                            >
                                                {vendor.approved ? 'Aktif' : 'Onaylanmamış'}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Simple Badge component update locally if needed, but existing should work
