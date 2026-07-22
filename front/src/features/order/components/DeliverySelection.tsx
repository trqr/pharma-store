import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useEffect, useState, useTransition} from "react";
import type {deliveryType} from "../types/delivery.type.ts";
import {getDeliveryMethods} from "../api/delivery.api.ts";
import deliveryImage from "../../../assets/delivery.png";
import {Card, CardActionArea, CardContent, CardHeader, Divider} from "@mui/material";
import Grid from "@mui/material/Grid";
import {useOrder} from "../contexts/OrderContext.tsx";

const DeliverySelection = () => {
    const [deliveryMethods, setDeliveryMethods] = useState<deliveryType[]>([]);
    const [isPending, startTransition] = useTransition()
    const {newOrder, setNewOrder} = useOrder()

    useEffect(() => {
        startTransition( async () => {
            const fetchedDeliveries = await getDeliveryMethods()
            setDeliveryMethods(fetchedDeliveries)
        })
    }, []);

    const handleDeliverySelect = (deliveryId: number, deliveryPrice: number) => {
        setNewOrder({...newOrder, deliveryId, deliveryPrice})
    }

    return (
        <>
            <Divider sx={{my: 3}}/>
            <Typography variant={"body1"} sx={{mb: 2}}>Choisissez votre mode de livraison</Typography>
            {isPending ?
                <div>Loading...</div>
                :
                <Grid container spacing={1}>
                    {deliveryMethods.map((delivery) => (
                        <Grid key={delivery.id} size={12}>
                            <Card
                                variant="outlined"
                                sx={(theme) => ({
                                    position: "relative",
                                    border: newOrder.deliveryId === delivery.id
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : `2px solid ${theme.palette.grey[100]}`,
                                    transition: "all 0.3s ease-in-out",
                                    bgcolor: newOrder.deliveryId === delivery.id
                                        ? "action.selected.light"
                                        : `${theme.palette.background.default}`,
                                })}
                            >
                                <CardActionArea
                                    onClick={() => handleDeliverySelect(delivery.id, delivery.price)}
                                    sx={{display: "flex", justifyContent: "space-between", pb: 2}}
                                >
                                    <CardHeader
                                        title={`${delivery.price.toFixed(2)} €`}
                                        subheader={delivery.name}
                                        sx={{pb: 0}}
                                        avatar={
                                            <Box
                                                component="img"
                                                src={deliveryImage}
                                                alt={delivery.name}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: "contain"
                                                }}
                                            />
                                        }
                                    />
                                    <CardContent>
                                        <Typography variant={"body2"}>
                                            Livraison en {delivery.minDeliveryDays}-{delivery.maxDeliveryDays} jours
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            }
        </>
    )
}
export default DeliverySelection;