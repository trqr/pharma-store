import type {CartItem} from "../../cart/types/cart.type.ts";

export type AuthResponse = {
    user: User,
    token: string
}

export type User = {
    id: number,
    email: string,
    role: string,
    cartItems: CartItem[]
}
