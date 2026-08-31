import { api } from "../../../api/axios.config"
import type {PaginatedResponse} from "../types/paginatedResponse.type.ts";

export const getProducts = async (
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
) : Promise<PaginatedResponse> => {
    const res = await api.get("/products/medicines", {
        params: {
            page: page,
            limit: limit,
            search: search,
            category: category
        }
    });
    return res.data;
}