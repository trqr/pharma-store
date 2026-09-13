import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? "/api",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return result;
};

/**
 * API RTK Query partagée.
 * Chaque feature injecte ses endpoints (productsApi, etc.).
 */
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Products", "Cart", "Orders", "Auth", "Addresses", "Delivery"],
    endpoints: () => ({}),
});
