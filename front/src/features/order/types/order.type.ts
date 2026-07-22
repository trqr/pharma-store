import type {CartItem} from "../../cart/types/cart.type.ts";

export type Order = {
    id : number,
    userEmail : string,
    status : string,
    cartItems : CartItem[],
    total : number,
    deliveryName : string,
    deliveryPrice : number,
    deliveryAddress : string,
    promoCode : string,
    discount : number,
    createdAt : Date
}

export type NewOrderRequest = {
    id: number,
    ids: number[],
    deliveryId: number,
    deliveryAddressId: number,
    deliveryPrice: number,
    promoCode: string,
    discount: number,
    totalPrice: number,
}

export type PaymentRequest = {
    orderId: number,
    creditCardNumber: string,
    creditCardExpirationDate: string,
    creditCardCvv: string,
    paymentMethodId: number,
    paymentAmount: number,
}