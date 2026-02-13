import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/data/mock-data";

export default function VendorFinancePage() {
    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold font-display">Finansal Özet</h1>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatPrice(42500)}</div>
                        <p className="text-xs text-muted-foreground mt-1">+%12 geçen aydan</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground mt-1">+14% geçen aydan</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detaylar gelecek */}
            <Card>
                <CardHeader>
                    <CardTitle>Son İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">Finansal verileriniz burada detaylandırılacak...</p>
                </CardContent>
            </Card>
        </div>
    );
}
