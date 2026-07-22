import {api} from "../../../api/axios.config.ts";

export const getDeliveryMethods = async () => {
    const res = await api.get('/delivery');
    return res.data;
}