import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function VendorAddProductPage() {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Ürün Kaydedildi!",
            description: "Yeni ürününüz onay sürecinden sonra yayına alınacaktır.",
        });
        navigate("/pastane/urunler");
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold font-display">Yeni Ürün Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Ürün Adı</Label>
                    <Input id="name" placeholder="Örn: Çikolatalı Rüzgar" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="desc">Açıklama</Label>
                    <Textarea id="desc" placeholder="Ürününüzü detaylandırın..." required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Başlangıç Fiyatı (₺)</Label>
                        <Input id="price" type="number" placeholder="500" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prep">Hazırlık Süresi (Gün)</Label>
                        <Input id="prep" type="number" placeholder="2" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Görsel</Label>
                    <div className="border-2 border-dashed rounded-xl p-8 text-center bg-slate-50">
                        <p className="text-sm text-muted-foreground">Sürükle ve bırak veya tıklayarak seç</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" type="button" onClick={() => navigate(-1)}>İptal</Button>
                    <Button className="flex-1" type="submit">Ürünü Oluştur</Button>
                </div>
            </form>
        </div>
    );
}
