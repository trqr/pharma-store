import OrdersList from "../features/order/components/OrdersList.tsx";
import {useLoaderData} from "react-router-dom";

const UserOrdersPage = () => {
    const orders = useLoaderData();

    return (
        <>
            {orders ? <OrdersList orders={orders}/> : <h1>Aucune commande</h1>}
        </>
    )
}

export default UserOrdersPage;