/**
 * Point d'entrée du store Redux.
 *
 * configureStore (Redux Toolkit) :
 * - crée le store
 * - branche Redux DevTools
 * - ajoute les middlewares utiles (dont celui qui gère les createAsyncThunk)
 */
import {configureStore} from "@reduxjs/toolkit";
import productsReducer from "../features/products/store/productsSlice";

export const store = configureStore({
    // Chaque clé devient une branche de state.products, state.cart, etc.
    reducer: {
        products: productsReducer,
    },
});

/**
 * Type de tout le state global.
 * Exemple : state.products.items, state.products.status
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type du dispatch, pour que TypeScript connaisse nos actions et nos thunks.
 */
export type AppDispatch = typeof store.dispatch;
