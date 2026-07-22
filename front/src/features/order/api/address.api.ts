import {api} from "../../../api/axios.config.ts";
import type {Address} from "../types/address.type.ts";

export const getUserAddresses = async () => {
    const res = await api.get('/users/addresses')
    return res.data;
}

export const addUserAddress = async (address: Address) => {
    const res = await api.post('/users/addresses/create', address);
    return res.data;
}
