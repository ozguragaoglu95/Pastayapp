import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Order, OrderStatus } from "@/types";

interface OrdersContextType {
    orders: Order[];
    createOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "statusHistory">) => string;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    getOrderById: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Mock initial orders
const MOCK_ORDERS: Order[] = [
    {
        id: "ord-1",
        userId: "user-1",
        vendorId: "vendor-1",
        templateProductId: "tmpl-1",
        totalPrice: 1200,
        commission: 120,
        status: "in_progress",
        statusHistory: [
            { status: "confirmed", timestamp: "2024-02-10T10:00:00Z" },
            { status: "in_progress", timestamp: "2024-02-11T09:00:00Z" }
        ],
        createdAt: "2024-02-10T10:00:00Z"
    }
];

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

    const createOrder = useCallback((orderData: Omit<Order, "id" | "createdAt" | "status" | "statusHistory">) => {
        const id = `ord-${Date.now()}`;
        const newOrder: Order = {
            id,
            createdAt: new Date().toISOString(),
            status: "confirmed",
            statusHistory: [
                { status: "confirmed", timestamp: new Date().toISOString() }
            ],
            ...orderData,
        };
        setOrders((prev) => [newOrder, ...prev]);
        return id;
    }, []);

    const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status,
                    statusHistory: [
                        ...order.statusHistory,
                        { status, timestamp: new Date().toISOString() }
                    ]
                };
            }
            return order;
        }));
    }, []);

    const getOrderById = useCallback((id: string) => {
        return orders.find((o) => o.id === id);
    }, [orders]);

    return (
        <OrdersContext.Provider value={{ orders, createOrder, updateOrderStatus, getOrderById }}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => {
    const ctx = useContext(OrdersContext);
    if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
    return ctx;
};
