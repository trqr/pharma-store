import {api} from "../../../api/axios.config.ts";
import type {NewOrderRequest, PaymentRequest} from "../types/order.type.ts";

export const getUserOrders = async () => {
    const res = await api.get('/order');
    return res.data;
}

export const createOrder = async (request: NewOrderRequest) => {
    const res = await api.post('/order/create', request);
    return res.data;
}

export const orderPayment = async (PaymentRequest: PaymentRequest) => {
    const res = await api.post('/order/payment', PaymentRequest);
    return res.data;
}