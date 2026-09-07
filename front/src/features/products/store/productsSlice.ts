/**
 * Slice "products" : tout l'état catalogue (liste, pagination, filtres, chargement).
 *
 * Un slice Toolkit regroupe :
 * - le state initial
 * - les reducers synchrones (filtres, page…)
 * - les extraReducers pour les appels API (createAsyncThunk)
 */
import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {getProducts} from "../api/product.api";
import {emptyPaginedRes, type PaginatedResponse} from "../types/paginatedResponse.type";
import type {Product} from "../types/product.type";

export type ProductsStatus = "idle" | "loading" | "succeeded" | "failed";

export type ProductsState = {
    items: Product[];
    pagination: PaginatedResponse["pagination"];
    page: number;
    limit: number;
    search: string;
    medicineType: string;
    status: ProductsStatus;
    error: string | null;
};

const initialState: ProductsState = {
    items: emptyPaginedRes.data,
    pagination: emptyPaginedRes.pagination,
    page: 1,
    limit: 6,
    search: "doliprane",
    medicineType: "",
    status: "idle",
    error: null,
};

/**
 * Thunk = action asynchrone.
 * RTK crée tout seul products/fetchProducts/pending, /fulfilled et /rejected.
 *
 * On passe les filtres en argument pour éviter un import circulaire
 * slice -> store -> slice.
 */
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (params: {
        page: number;
        limit: number;
        search: string;
        medicineType: string;
    }) => {
        return getProducts(params.page, params.limit, params.search, params.medicineType);
    },
);

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setLimit(state, action: PayloadAction<number>) {
            state.limit = action.payload;
            state.page = 1;
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1;
        },
        setMedicineType(state, action: PayloadAction<string>) {
            state.medicineType = action.payload;
            state.page = 1;
        },
    },
    /**
     * Réactions au cycle de vie du thunk fetchProducts.
     */
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message ?? "Impossible de charger les produits";
            });
    },
});

export const {setPage, setLimit, setSearch, setMedicineType} = productsSlice.actions;

export default productsSlice.reducer;
