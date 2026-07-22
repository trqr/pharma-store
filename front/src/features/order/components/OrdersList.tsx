import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import type { Order } from "../types/order.type";

type OrdersListProps = {
    orders: Order[];
};

const getStatusColor = (
    status: string
):
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info" => {
    switch (status.toLowerCase()) {
        case "paid":
        case "completed":
            return "success";

        case "pending":
            return "warning";

        case "cancelled":
            return "error";

        default:
            return "info";
    }
};

export default function OrdersList({ orders }: OrdersListProps) {
    return (
        <Stack spacing={2}>
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardContent>
                        <Stack
                            direction="row"
                            sx={{mb: 2, justifyContent: "space-between", alignItems: "center"}}
                        >
                            <Box>
                                <Typography variant="h6">
                                    Commande #{order.id}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {order.userEmail}
                                </Typography>
                            </Box>

                            <Chip
                                label={order.status}
                                color={getStatusColor(order.status)}
                            />
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                            {new Date(order.createdAt).toLocaleString("fr-FR")}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" gutterBottom>
                            Produits
                        </Typography>

                        <Stack spacing={1}>
                            {order.cartItems.map((item) => (
                                <Box
                                    key={item.id}
                                    sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                                >
                                    <Box>
                                        <Typography>
                                            {item.product.name}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            CIS : {item.product.cis}
                                        </Typography>
                                    </Box>

                                    <Typography>
                                        {item.quantity} ×{" "}
                                        {(item.product.promotionPrice ??
                                            item.product.price ??
                                            0
                                        ).toFixed(2)}
                                        €
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2">
                            Livraison
                        </Typography>

                        <Typography variant="body2">
                            {order.deliveryName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {order.deliveryAddress}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ mt: 1 }}
                        >
                            Frais de livraison :{" "}
                            {order.deliveryPrice.toFixed(2)} €
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Stack
                            direction={"row"}
                            sx={{justifyContent: "flex-end"}}
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Sous-total : {(order.total - order.deliveryPrice).toFixed(2)} €
                                </Typography>

                                {order.discount > 0 && (
                                    <Typography
                                        variant="body2"
                                        color="success"
                                    >
                                        Remise : - {order.discount.toFixed(2)}%
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="h6">
                                Total : {order.total.toFixed(2)} €
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>

            ))}

        </Stack>
    );
}