import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CustomRequest, CustomRequestSpec } from "@/types";
import { mockRequests } from "@/data/mock-requests";

import { Offer } from "@/types";

interface RequestsContextType {
    requests: CustomRequest[];
    addRequest: (request: Omit<CustomRequest, "id" | "createdAt" | "status" | "offers">) => CustomRequest;
    addOffer: (requestId: string, offer: Omit<Offer, "id" | "createdAt" | "requestId" | "vendorId">) => void;
    updateRequestStatus: (id: string, status: import("@/types").RequestStatus, selectedOfferId?: string) => void;
    getRequestById: (id: string) => CustomRequest | undefined;
    sendMessage: (requestId: string, text: string, senderId: string, role: import("@/types").UserRole) => void;
    updateRequestSpec: (id: string, spec: CustomRequestSpec) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
    const [requests, setRequests] = useState<CustomRequest[]>(mockRequests);

    const sendMessage = useCallback((requestId: string, text: string, senderId: string, role: import("@/types").UserRole) => {
        setRequests((prev) => prev.map((req) => {
            if (req.id === requestId) {
                const newMessage: import("@/types").ChatMessage = {
                    id: `msg-${Date.now()}`,
                    threadId: requestId,
                    senderId,
                    senderRole: role,
                    text,
                    createdAt: new Date().toISOString(),
                };
                return {
                    ...req,
                    messages: [...(req.messages || []), newMessage]
                };
            }
            return req;
        }));
    }, []);

    const addRequest = useCallback((newRequestData: Omit<CustomRequest, "id" | "createdAt" | "status" | "offers">) => {
        const newRequest: CustomRequest = {
            id: `req-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: "pending",
            offers: [],
            ...newRequestData,
        };
        setRequests((prev) => [newRequest, ...prev]);
        return newRequest;
    }, []);

    const updateRequestStatus = useCallback((id: string, status: import("@/types").RequestStatus, selectedOfferId?: string) => {
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status, selectedOfferId: selectedOfferId || req.selectedOfferId } : req)));
    }, []);

    const addOffer = useCallback((requestId: string, offerData: Omit<Offer, "id" | "createdAt" | "requestId" | "vendorId">) => {
        setRequests((prev) => prev.map((req) => {
            if (req.id === requestId) {
                const newOffer: Offer = {
                    id: `offer-${Date.now()}`,
                    requestId,
                    vendorId: "vendor-1", // Mock vendor ID, normally from auth
                    createdAt: new Date().toISOString(),
                    ...offerData
                };

                // Update status to 'offers_received' if it was pending or waiting
                const newStatus = (req.status === 'pending' || req.status === 'waiting_offers' || req.status === 'draft')
                    ? 'offers_received'
                    : req.status;

                return {
                    ...req,
                    status: newStatus,
                    offers: [newOffer, ...req.offers] // Add new offer to top
                };
            }
            return req;
        }));
    }, []);

    const getRequestById = useCallback((id: string) => {
        return requests.find((req) => req.id === id);
    }, [requests]);

    const updateRequestSpec = useCallback((id: string, spec: CustomRequestSpec) => {
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, spec } : req)));
    }, []);

    return (
        <RequestsContext.Provider value={{ requests, addRequest, addOffer, updateRequestStatus, getRequestById, sendMessage, updateRequestSpec }}>
            {children}
        </RequestsContext.Provider>
    );
};

export const useRequests = () => {
    const ctx = useContext(RequestsContext);
    if (!ctx) throw new Error("useRequests must be used within RequestsProvider");
    return ctx;
};
