import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import './index.css'
import App from './App.tsx'
import {theme} from "./themes/themes.ts";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material";
import {AuthProvider} from "./features/auth/contexts/AuthContext.tsx";
import {CartProvider} from "./features/cart/contexts/CartContext.tsx";
import {OrderProvider} from "./features/order/contexts/OrderContext.tsx";
import {store} from "./app/store.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* Provider rend le store accessible à tous les hooks useAppSelector / useAppDispatch */}
        <Provider store={store}>
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
        </Provider>
    </StrictMode>,
)
