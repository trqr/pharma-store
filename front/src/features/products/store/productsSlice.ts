/**
 * Slice "products" : filtres UI du catalogue (page, recherche, type).
 * Les données et le chargement sont gérés par RTK Query (productsApi).
 */
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type ProductsFiltersState = {
    page: number;
    limit: number;
    search: string;
    medicineType: string;
};

const initialState: ProductsFiltersState = {
    page: 1,
    limit: 6,
    search: "doliprane",
    medicineType: "",
};

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
});

export const {setPage, setLimit, setSearch, setMedicineType} = productsSlice.actions;

export default productsSlice.reducer;
