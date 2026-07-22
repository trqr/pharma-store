import {createBrowserRouter} from "react-router-dom";
import Layout from "../pages/layout/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute.tsx";
import CheckoutPage from "../pages/CheckoutPage.tsx";
import PaymentPage from "../pages/PaymentPage.tsx";
import UserOrdersPage from "../pages/UserOrdersPage.tsx";
import {getUserOrders} from "../features/order/api/orders.api.ts";

export const router = createBrowserRouter([
    {
        element: <LoginPage/>,
        path: "/login",
    },
    {
        element: <ProtectedRoute roles={["ROLE_USER", "ROLE_ADMIN"]}>
            <Layout/>
        </ProtectedRoute>,
        children: [
            {
                path: "/",
                element: <HomePage/>,
            },
            {
                path: "/products",
                element: <HomePage/>,
            },
            {
                path: "/checkout",
                element: <CheckoutPage/>,
            },
            {
                path: "/payment",
                element: <PaymentPage/>,
            },
            {
                path: "/user/orders",
                element: <UserOrdersPage/>,
                loader: async () => await getUserOrders()
            },
        ],
    },
]);
