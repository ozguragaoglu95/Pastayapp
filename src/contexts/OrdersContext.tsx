import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Order, OrderStatus } from "@/types";

interface OrdersContextType {
    orders: Order[];
    createOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "statusHistory">) => string;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    getOrderById: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Mock initial orders - Comprehensive dummy data
const MOCK_ORDERS: Order[] = [
    {
        id: "ord-2401",
        userId: "user-1",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-1",
        totalPrice: 1200,
        commission: 120,
        status: "preparing",
        deliveryAddress: "Kadıköy, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-15T10:00:00Z" },
            { status: "preparing", timestamp: "2026-02-16T09:00:00Z" }
        ],
        createdAt: "2026-02-15T10:00:00Z"
    },
    {
        id: "ord-2402",
        userId: "user-2",
        vendorId: "u-vendor1",
        requestId: "req-101",
        totalPrice: 1850,
        commission: 185,
        status: "confirmed",
        deliveryAddress: "Beşiktaş, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-17T14:30:00Z" }
        ],
        createdAt: "2026-02-17T14:30:00Z"
    },
    {
        id: "ord-2403",
        userId: "user-3",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-3",
        totalPrice: 950,
        commission: 95,
        status: "ready",
        deliveryAddress: "Şişli, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-14T11:00:00Z" },
            { status: "preparing", timestamp: "2026-02-15T08:00:00Z" },
            { status: "ready", timestamp: "2026-02-17T16:00:00Z" }
        ],
        createdAt: "2026-02-14T11:00:00Z"
    },
    {
        id: "ord-2404",
        userId: "user-4",
        vendorId: "u-vendor1",
        requestId: "req-102",
        totalPrice: 2100,
        commission: 210,
        status: "shipped",
        deliveryAddress: "Üsküdar, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-10T09:00:00Z" },
            { status: "preparing", timestamp: "2026-02-11T10:00:00Z" },
            { status: "completed", timestamp: "2026-02-13T15:00:00Z" },
            { status: "shipped", timestamp: "2026-02-14T18:00:00Z" }
        ],
        createdAt: "2026-02-10T09:00:00Z"
    },
    {
        id: "ord-2405",
        userId: "user-5",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-2",
        totalPrice: 1450,
        commission: 145,
        status: "preparing",
        deliveryAddress: "Bakırköy, İstanbul",
        hasChangeRequest: true,
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-16T13:00:00Z" },
            { status: "preparing", timestamp: "2026-02-17T08:30:00Z" }
        ],
        createdAt: "2026-02-16T13:00:00Z"
    },
    {
        id: "ord-2406",
        userId: "user-6",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-4",
        totalPrice: 1750,
        commission: 175,
        status: "completed",
        deliveryAddress: "Maltepe, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-08T10:00:00Z" },
            { status: "preparing", timestamp: "2026-02-09T09:00:00Z" },
            { status: "ready", timestamp: "2026-02-11T14:00:00Z" },
            { status: "completed", timestamp: "2026-02-12T17:00:00Z" }
        ],
        createdAt: "2026-02-08T10:00:00Z"
    },
    {
        id: "ord-2407",
        userId: "user-7",
        vendorId: "u-vendor1",
        requestId: "req-103",
        totalPrice: 3200,
        commission: 320,
        status: "cancelled",
        deliveryAddress: "Sarıyer, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-05T11:00:00Z" },
            { status: "cancelled", timestamp: "2026-02-06T09:00:00Z", note: "Müşteri talebi" }
        ],
        createdAt: "2026-02-05T11:00:00Z"
    },
    {
        id: "ord-2408",
        userId: "user-8",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-5",
        totalPrice: 1100,
        commission: 110,
        status: "completed",
        deliveryAddress: "Ataşehir, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-01-28T10:00:00Z" },
            { status: "preparing", timestamp: "2026-01-29T09:00:00Z" },
            { status: "ready", timestamp: "2026-01-31T15:00:00Z" },
            { status: "completed", timestamp: "2026-02-01T16:00:00Z" }
        ],
        createdAt: "2026-01-28T10:00:00Z"
    },
    {
        id: "ord-2409",
        userId: "user-9",
        vendorId: "u-vendor1",
        requestId: "req-104",
        totalPrice: 2450,
        commission: 245,
        status: "returned",
        deliveryAddress: "Beyoğlu, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-01-25T12:00:00Z" },
            { status: "preparing", timestamp: "2026-01-26T10:00:00Z" },
            { status: "ready", timestamp: "2026-01-28T14:00:00Z" },
            { status: "completed", timestamp: "2026-01-29T17:00:00Z" },
            { status: "returned", timestamp: "2026-01-30T10:00:00Z", note: "Ürün hasarlı" }
        ],
        createdAt: "2026-01-25T12:00:00Z"
    },
    {
        id: "ord-2410",
        userId: "user-10",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-1",
        totalPrice: 1350,
        commission: 135,
        status: "completed",
        deliveryAddress: "Kartal, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-01-20T09:00:00Z" },
            { status: "preparing", timestamp: "2026-01-21T08:00:00Z" },
            { status: "ready", timestamp: "2026-01-23T13:00:00Z" },
            { status: "completed", timestamp: "2026-01-24T15:00:00Z" }
        ],
        createdAt: "2026-01-20T09:00:00Z"
    },
    {
        id: "ord-2411",
        userId: "user-11",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-3",
        totalPrice: 1650,
        commission: 165,
        status: "in_progress",
        deliveryAddress: "Pendik, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-16T15:00:00Z" },
            { status: "in_progress", timestamp: "2026-02-17T10:00:00Z" }
        ],
        createdAt: "2026-02-16T15:00:00Z"
    },
    {
        id: "ord-2412",
        userId: "user-12",
        vendorId: "u-vendor1",
        requestId: "req-105",
        totalPrice: 2800,
        commission: 280,
        status: "completed",
        deliveryAddress: "Tuzla, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-01-15T11:00:00Z" },
            { status: "preparing", timestamp: "2026-01-16T09:00:00Z" },
            { status: "ready", timestamp: "2026-01-18T16:00:00Z" },
            { status: "completed", timestamp: "2026-01-19T18:00:00Z" }
        ],
        createdAt: "2026-01-15T11:00:00Z"
    },
    {
        id: "ord-2413",
        userId: "user-13",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-2",
        totalPrice: 1550,
        commission: 155,
        status: "confirmed",
        deliveryAddress: "Çekmeköy, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-17T16:00:00Z" }
        ],
        createdAt: "2026-02-17T16:00:00Z"
    },
    {
        id: "ord-2414",
        userId: "user-14",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-4",
        totalPrice: 1900,
        commission: 190,
        status: "completed",
        deliveryAddress: "Sancaktepe, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-01-10T10:00:00Z" },
            { status: "preparing", timestamp: "2026-01-11T09:00:00Z" },
            { status: "ready", timestamp: "2026-01-13T14:00:00Z" },
            { status: "completed", timestamp: "2026-01-14T16:00:00Z" }
        ],
        createdAt: "2026-01-10T10:00:00Z"
    },
    {
        id: "ord-2415",
        userId: "user-15",
        vendorId: "u-vendor1",
        requestId: "req-106",
        totalPrice: 2200,
        commission: 220,
        status: "cancelled",
        deliveryAddress: "Sultanbeyli, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-03T12:00:00Z" },
            { status: "cancelled", timestamp: "2026-02-04T10:00:00Z", note: "Stok yetersiz" }
        ],
        createdAt: "2026-02-03T12:00:00Z"
    },
    {
        id: "ord-2416",
        userId: "user-16",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-5",
        totalPrice: 1250,
        commission: 125,
        status: "ready",
        deliveryAddress: "Eyüpsultan, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2026-02-13T09:00:00Z" },
            { status: "preparing", timestamp: "2026-02-14T08:00:00Z" },
            { status: "ready", timestamp: "2026-02-17T12:00:00Z" }
        ],
        createdAt: "2026-02-13T09:00:00Z"
    },
    {
        id: "ord-2417",
        userId: "user-17",
        vendorId: "u-vendor1",
        templateProductId: "tmpl-1",
        totalPrice: 1400,
        commission: 140,
        status: "completed",
        deliveryAddress: "Gaziosmanpaşa, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2025-12-28T10:00:00Z" },
            { status: "preparing", timestamp: "2025-12-29T09:00:00Z" },
            { status: "ready", timestamp: "2025-12-31T15:00:00Z" },
            { status: "completed", timestamp: "2026-01-01T17:00:00Z" }
        ],
        createdAt: "2025-12-28T10:00:00Z"
    },
    {
        id: "ord-2418",
        userId: "user-18",
        vendorId: "u-vendor1",
        requestId: "req-107",
        totalPrice: 3500,
        commission: 350,
        status: "completed",
        deliveryAddress: "Esenler, İstanbul",
        statusHistory: [
            { status: "confirmed", timestamp: "2025-12-20T11:00:00Z" },
            { status: "preparing", timestamp: "2025-12-21T10:00:00Z" },
            { status: "ready", timestamp: "2025-12-23T16:00:00Z" },
            { status: "completed", timestamp: "2025-12-24T18:00:00Z" }
        ],
        createdAt: "2025-12-20T11:00:00Z"
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
