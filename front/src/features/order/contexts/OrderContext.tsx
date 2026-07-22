import {createContext, type ReactNode, useContext, useEffect, useState, useTransition} from "react";
import type {NewOrderRequest, Order} from "../types/order.type.ts";
import {getUserOrders} from "../api/orders.api.ts";

type OrderContextType = {
    orders: Order[];
    newOrder: NewOrderRequest;
    setNewOrder: (order: NewOrderRequest) => void;
    isPending: boolean;
};

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({children}: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([])
    const [isPending, startTransition] = useTransition()
    const [newOrder, setNewOrder] = useState<NewOrderRequest>({
        id: 0,
        ids: [],
        deliveryId: 0,
        deliveryAddressId: 0,
        deliveryPrice: 0,
        promoCode: "",
        discount: 0,
        totalPrice: 0,
    })

    useEffect(() => {
        if (!localStorage.getItem("token")) return;

        startTransition( async () => {
            const fetchedOrders = await getUserOrders();
            setOrders(fetchedOrders)
        })
    }, []);

    return (
        <OrderContext.Provider
            value={{
                orders,
                newOrder,
                setNewOrder,
                isPending
        }}>
            {children}
        </OrderContext.Provider>
    )
}


export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};