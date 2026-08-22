import {createContext, type ReactNode, useContext, useEffect, useState, useTransition} from "react";
import type {CartItem} from "../types/cart.type.ts";
import {addToCart, removeFromCart} from "../api/cart.api.ts";
import type {Product} from "../../products/types/product.type.ts";
import {useOrder} from "../../order/contexts/OrderContext.tsx";
import {toast} from "react-toastify";

type CartContextType = {
    cart: CartItem[],
    setCart: (items: CartItem[]) => void
    totalQuantity: number,
    totalPrice: number,
    addItem: (product: Product, quantity: number) => void,
    removeItem: (id: number) => void,
    clearCart: () => void,
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [, startTransition] = useTransition();
    const {newOrder} = useOrder();
    function getTotalQuantity() {
        let total = 0;
        for (let i = 0; i < cart.length ; i++){
            total += cart[i].quantity;
        }
        setTotalQuantity(total);
    }

    function getTotalPrice() {
        const totalPrice = cart
            .reduce((acc, item) =>
                acc + item.quantity * (item.product.promotionPrice ?? item.product.price ?? 0), 0);
        if (newOrder.discount > 0) {
            return setTotalPrice(
                totalPrice - (totalPrice * newOrder.discount) / 100
            )
        }
        return setTotalPrice(totalPrice);
    }

    async function addItem(product: Product, quantity?: number) {
        try {
            const res = await addToCart(product.productId, quantity);
            setCart((prev) => [
                ...prev,
                res.item
            ]);
            toast.success(res.message)
        }
        catch (e) {
            console.error(e);
            toast.error(e.message)
        }
    }

    async function removeItem(id: number) {
        try {
            const res = await removeFromCart(id);
            setCart(prevCart => prevCart.filter(item => item.id !== id));
            toast.success(res.message)
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        startTransition(() => {
            getTotalQuantity();
            getTotalPrice();
        })
    }, [cart, newOrder.discount]);


    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                totalQuantity,
                totalPrice,
                addItem,
                removeItem,
                clearCart: () => {},
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within an CartProvider');
    }
    return context;
};
