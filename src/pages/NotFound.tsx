import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <h1 className="font-display text-7xl font-bold text-gradient">404</h1>
            <p className="text-lg text-muted-foreground mt-2">Oops! Sayfa bulunamadı</p>
            <Button asChild className="mt-6">
                <Link to="/">Ana Sayfaya Dön</Link>
            </Button>
        </div>
    );
}
