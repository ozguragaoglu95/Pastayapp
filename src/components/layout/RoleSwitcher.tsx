import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { User, Store, Shield } from 'lucide-react';

const roles: { role: UserRole; icon: typeof User; label: string }[] = [
    { role: 'customer', icon: User, label: 'Müşteri' },
    { role: 'vendor', icon: Store, label: 'Pastane' },
    { role: 'admin', icon: Shield, label: 'Admin' },
];

export default function RoleSwitcher() {
    const { user, switchRole } = useAuth();

    return (
        <div className="flex items-center gap-1">
            {roles.map(({ role, icon: Icon, label }) => (
                <Button
                    key={role}
                    variant={user?.role === role ? 'default' : 'ghost'}
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => switchRole(role)}
                >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{label}</span>
                </Button>
            ))}
        </div>
    );
}
