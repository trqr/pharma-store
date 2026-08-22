import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {router} from "./router/router";
import {RouterProvider} from "react-router-dom";
import {Bounce, ToastContainer} from "react-toastify";

function App() {
    return (
        <>
            <RouterProvider router={router}/>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </>
    )
        ;
}

export default App;
