import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
    const { items } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
                <Link to="/" className="font-display font-bold text-xl text-gradient">
                    CakeCraft
                </Link>

                <div className="flex items-center gap-3">
                    {/* Public Nav */}
                    {!user && (
                        <nav className="hidden md:flex gap-4 mr-4 text-sm font-medium text-muted-foreground">
                            <Link to="/tasarimlar" className="hover:text-primary transition-colors">Tasarımlar</Link>
                            <Link to="/tasarla" className="hover:text-primary transition-colors">Tasarla</Link>
                        </nav>
                    )}

                    {/* Cart - Only for Customers or Guests */}
                    {(!user || user.role === 'customer') && (
                        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/sepet")}>
                            <ShoppingCart className="h-5 w-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                                    {items.length}
                                </span>
                            )}
                        </Button>
                    )}

                    {/* Auth Status */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate(user.role === 'vendor' ? '/pastane/panel' : user.role === 'admin' ? '/admin' : '/profil')}>
                                    {user.role === 'vendor' ? <LayoutDashboard className="mr-2 h-4 w-4" /> : <User className="mr-2 h-4 w-4" />}
                                    {user.role === 'vendor' ? 'Satıcı Paneli' : user.role === 'admin' ? 'Yönetici Paneli' : 'Profilim'}
                                </DropdownMenuItem>
                                {user.role === 'customer' && (
                                    <DropdownMenuItem onClick={() => navigate('/taleplerim')}>
                                        <ClipboardList className="mr-2 h-4 w-4" />
                                        Taleplerim
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Çıkış Yap
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                                Giriş
                            </Button>
                            <Button size="sm" onClick={() => navigate("/login")}>
                                Kayıt Ol
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

import { ClipboardList } from 'lucide-react';
