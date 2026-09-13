import {baseApi} from "../../../api/baseApi";
import type {PaginatedResponse} from "../types/paginatedResponse.type.ts";

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<PaginatedResponse, {
            page?: number;
            limit?: number;
            search?: string;
            category?: string;
        }>({
            query: ({page, limit, search, category}) => ({
                url: "/products/medicines",
                params: {page, limit, search, category},
            }),
            providesTags: ["Products"],
        }),
    }),
});

export const {useGetProductsQuery} = productsApi;
