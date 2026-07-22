import {api} from "../../../api/axios.config.ts";

export const addToCart = async (productId: number, quantity?: number) => {
    const res = await api.post(`/cart/add/${productId}?quantity=${quantity}`);
    return res.data;
}

export const removeFromCart = async (id: number) => {
    const res = await api.delete(`/cart/remove/${id}`);
    return res.data;
}
