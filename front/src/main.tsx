import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {theme} from "./themes/themes.ts";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material";
import {AuthProvider} from "./features/auth/contexts/AuthContext.tsx";
import {CartProvider} from "./features/cart/contexts/CartContext.tsx";
import {OrderProvider} from "./features/order/contexts/OrderContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <OrderProvider>
            <CartProvider>
                <AuthProvider>
                    <ThemeProvider theme={theme} defaultMode={"system"}>
                        <CssBaseline/>
                        <App/>
                    </ThemeProvider>
                </AuthProvider>
            </CartProvider>
        </OrderProvider>
    </StrictMode>,
)
