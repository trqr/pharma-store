import {api} from "../../../api/axios.config.ts";

type PromoCodeResponse = {
    id: number,
    discount: number,
    code: string,
    active: boolean,
}

export const getPromoCodeDiscount  = async (promoCode: string) : Promise<PromoCodeResponse> => {
    const res = await api.get('promo-codes/validate?code=' + promoCode)
    return res.data;
}