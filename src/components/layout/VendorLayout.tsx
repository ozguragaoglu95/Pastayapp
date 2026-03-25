import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    BarChart3,
    Settings,
    Home,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleSwitcher from './RoleSwitcher';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../PageTransition';

const sidebarItems = [
    { to: '/pastane/panel', icon: LayoutDashboard, label: 'Panel' },
    { to: '/pastane/siparisler', icon: Package, label: 'Siparişler' },
    { to: '/pastane/finans', icon: BarChart3, label: 'Finansal Özet' },
];

export default function VendorLayout() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 240 }}
                className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border p-4 sticky top-0 h-screen flex-shrink-0 transition-all duration-300 ease-in-out z-50 overflow-y-auto"
            >
                <div className={`font-display font-bold text-lg text-sidebar-foreground mb-8 flex items-center ${isCollapsed ? 'justify-center' : 'px-2'}`}>
                    {isCollapsed ? "🎂" : "🎂 Pastane"}
                </div>

                <nav className="flex flex-col gap-2">
                    {sidebarItems.map(({ to, icon: Icon, label }) => {
                        const active = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                                    }`}
                            >
                                <Icon className={`h-5 w-5 ${active ? '' : 'text-slate-400'}`} />
                                {!isCollapsed && <span>{label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto flex flex-col gap-2">
                    <Link
                        to="/pastane/ayarlar"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${location.pathname === '/pastane/ayarlar' ? 'bg-primary text-white' : 'text-sidebar-foreground hover:bg-sidebar-accent'
                            }`}
                    >
                        <Settings className="h-5 w-5 text-slate-400" />
                        {!isCollapsed && <span>Ayarlar</span>}
                    </Link>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent transition-all"
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        {!isCollapsed && <span>Paneli Gizle</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border h-14 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <span className="font-display font-bold text-lg md:hidden">🎂 Pastane</span>

                        <Button variant="ghost" size="sm" asChild className="hidden md:flex text-muted-foreground hover:text-primary font-bold">
                            <Link to="/magaza/v1" className="gap-2">
                                <Home className="h-4 w-4" />
                                <span>Mağazayı Gör</span>
                            </Link>
                        </Button>
                    </div>
                    <RoleSwitcher />
                </header>
                <main className="flex-1 overflow-x-hidden bg-slate-50/50">
                    <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                            <Outlet />
                        </PageTransition>
                    </AnimatePresence>
                </main>

                {/* Mobile Bottom Navigation for Vendor */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 flex items-center justify-around py-3 px-2 safe-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    {[
                        ...sidebarItems,
                        { to: '/pastane/ayarlar', icon: Settings, label: 'Ayarlar' }
                    ].map(({ to, icon: Icon, label }) => {
                        const active = location.pathname.startsWith(to) && (to !== '/pastane/panel' || location.pathname === '/pastane/panel');
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`flex flex-col items-center gap-1 min-w-[64px] ${active ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Icon className={`h-6 w-6 transition-all ${active ? 'scale-110' : ''}`} />
                                <span className={`text-[10px] font-bold transition-all ${active ? 'opacity-100' : 'opacity-70'}`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
