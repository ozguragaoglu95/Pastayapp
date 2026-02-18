import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface RegisterData {
    phone: string;
    name: string;
    role: UserRole;
    email?: string;
    taxId?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    login: (phone: string, role: UserRole) => void;
    register: (data: RegisterData) => Promise<User>;
    logout: () => void;
    switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const mockUsers: Record<UserRole, User> = {
    customer: { id: 'u-customer1', phone: '5551234567', name: 'Deniz Yıldız', role: 'customer', avatar: '', email: 'müşteri@cakecraft.tr' },
    vendor: { id: 'u-vendor1', phone: '5559876543', name: 'Ayşe Yılmaz', role: 'vendor', avatar: '', email: 'pastane@cakecraft.tr', taxId: '1234567890', address: 'Kadıköy, İstanbul' },
    admin: { id: 'u-admin1', phone: '5550000000', name: 'Admin', role: 'admin', avatar: '', email: 'admin@cakecraft.tr' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (_email: string, role: UserRole) => setUser(mockUsers[role]);

    const register = (data: RegisterData): Promise<User> => {
        return new Promise((resolve) => {
            const newUser: User = {
                id: `u-${Date.now()}`,
                phone: data.phone,
                name: data.name,
                role: data.role,
                email: data.email,
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
