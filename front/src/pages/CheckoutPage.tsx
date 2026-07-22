import {Grid} from "@mui/material";
import OrderSummary from "../features/order/components/OrderSummary.tsx";
import DeliverySelection from "../features/order/components/DeliverySelection.tsx";
import AddressSection from "../features/order/components/AddressSection.tsx";

const CheckoutPage = () => {
    return (
        <>
            <Grid container spacing={2}>
                <Grid size={5.5}>
                    <AddressSection/>
                    <DeliverySelection/>
                </Grid>
                <Grid size={6.5}>
                    <OrderSummary/>
                </Grid>
            </Grid>
        </>
    )
}

export default CheckoutPage;