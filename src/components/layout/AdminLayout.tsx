import { Outlet, Link } from 'react-router-dom';
import RoleSwitcher from './RoleSwitcher';
import { Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <Home className="h-4 w-4" />
                        </div>
                        <span className="font-display font-bold text-lg hidden sm:block">CakeCraft</span>
                    </Link>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                    <span className="font-semibold text-slate-600 text-sm">🛡️ Admin Panel</span>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-primary">
                        <Link to="/" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden md:inline">Siteye Dön</span>
                        </Link>
                    </Button>
                    <RoleSwitcher />
                </div>
            </header>
            <main className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
