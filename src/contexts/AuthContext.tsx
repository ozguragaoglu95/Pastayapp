import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface RegisterData {
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    taxId?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole) => void;
    register: (data: RegisterData) => Promise<User>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const mockUsers: Record<UserRole, User> = {
    customer: { id: 'u-customer1', email: 'müşteri@cakecraft.tr', name: 'Deniz Yıldız', role: 'customer', avatar: '', phone: '5551234567' },
    vendor: { id: 'u-vendor1', email: 'pastane@cakecraft.tr', name: 'Ayşe Yılmaz', role: 'vendor', avatar: '', phone: '5559876543', taxId: '1234567890', address: 'Kadıköy, İstanbul' },
    admin: { id: 'u-admin1', email: 'admin@cakecraft.tr', name: 'Admin', role: 'admin', avatar: '' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (_email: string, role: UserRole) => setUser(mockUsers[role]);

    const register = (data: RegisterData): Promise<User> => {
        return new Promise((resolve) => {
            const newUser: User = {
                id: `u-${Date.now()}`,
                email: data.email,
                name: data.name,
                role: data.role,
                phone: data.phone,
                taxId: data.taxId,
                address: data.address,
                avatar: ''
            };
            setUser(newUser);
            resolve(newUser);
        });
    };

    const logout = () => setUser(null);
    const switchRole = (role: UserRole) => setUser(mockUsers[role]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, switchRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
