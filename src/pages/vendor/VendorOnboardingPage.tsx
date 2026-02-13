import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function VendorOnboardingPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            toast({
                title: 'Başvurunuz Alındı!',
                description: 'Onay sürecinden sonra panele erişebileceksiniz.',
            });
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        <span className="text-3xl">🎂</span>
                        <br />
                        Pastane Kayıt
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Pastane Adı</Label>
                            <Input id="name" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Yetkili Kişi</Label>
                            <Input id="contact" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input id="phone" type="tel" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">Şehir</Label>
                            <Input id="city" defaultValue="İstanbul" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="district">İlçe</Label>
                            <Input id="district" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Gönderiliyor...' : 'Başvuru Yap'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
