import { mockTemplates } from "@/data/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function VendorProductsPage() {
    // Mock filter for this specific vendor (v1)
    const vendorProducts = mockTemplates.filter(t => t.vendorId === 'v1');

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-display">Tüm Ürünlerim</h1>
                <Button asChild>
                    <Link to="/pastane/urun-ekle">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Ürün
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vendorProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden group">
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        <CardContent className="p-3">
                            <h3 className="font-bold text-sm truncate">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.basePrice} ₺</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
