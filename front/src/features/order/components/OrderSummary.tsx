import Typography from "@mui/material/Typography";
import {useCart} from "../../cart/contexts/CartContext.tsx";
import Stack from "@mui/material/Stack";
import {Alert, Button, Divider, Paper, TextField} from "@mui/material";
import type {CartItem} from "../../cart/types/cart.type.ts";
import {getProductIcon} from "../../products/utils/productIcon.ts";
import Grid from "@mui/material/Grid";
import {useOrder} from "../contexts/OrderContext.tsx";
import {createOrder} from "../api/orders.api.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getPromoCodeDiscount} from "../api/promo-code.api.ts";
import Box from "@mui/material/Box";
import type {ApiError} from "../../../api/axios.type.ts";

const OrderSummary = () => {
    const {cart, totalPrice, clearCart} = useCart();
    const {newOrder, setNewOrder} = useOrder();
    const [promoCode, setPromoCode] = useState<string>("")
    const [errorMsg, setErrorMsg] = useState<string>("")
    const [promoCodeError, setPromoCodeError] = useState<string>("")
    const navigate = useNavigate();

    const getCartItemsIds = () => {
        return cart.map((item: CartItem) => item.id);
    }

    useEffect(() => {
        setNewOrder({...newOrder, ids: getCartItemsIds()});
    }, []);

    const handlePromoCode = async (code: string) => {
        try {
            const res = await getPromoCodeDiscount(code)
            setNewOrder({...newOrder, promoCode: code, discount: res.discount})
            setPromoCodeError("")
        } catch (error) {
            console.error(error)
            setPromoCodeError("Le code promo est invalide")
        }
    }

    const handleSubmit = async () => {
        try {
            const res = await createOrder(newOrder);
            setNewOrder({...newOrder, id: res.id, totalPrice: res.total});
            navigate("/payment");
            clearCart();
        } catch (error) {
            const e = error as ApiError;
            console.error(e);
            setErrorMsg(e.detail ?? "Une erreur est survenue lors de la création de votre commande");
        }
    }

    return (
        <>
            <Stack direction={"column"} sx={{mb: 2, pt: 2}}>
                <Typography variant={"h5"} color={"textPrimary"}>Récapitulatif de votre commande</Typography>
                <Typography variant={"body2"} color={"textSecondary"}>Vérifiez votre panier et choississez votre mode de
                    livraison</Typography>
            </Stack>
            <Paper variant={"outlined"}>
                {cart.length === 0 ?
                    <Typography variant={"body1"} color={"textPrimary"}>Votre panier est vide</Typography>
                    :
                    cart.map((item: CartItem, index) => {
                        const Icon = getProductIcon(item.product.description)
                        const productPrice = (item.product.promotionPrice ?? item.product.price ?? 0).toFixed(2)

                        return (<Box>
                                <Grid container spacing={2} key={item.id} sx={{m: 1}}>
                                    <Grid size={1.3}>
                                        <Paper variant={"outlined"} sx={{
                                            p: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: 53,
                                            height: 53
                                        }}>
                                            <Icon color={"secondary"} fontSize={"large"}/>
                                        </Paper>
                                    </Grid>
                                    <Grid size={7.4}>
                                        <Stack direction={"column"}>
                                            <Typography variant={"body1"}>{item.product.name} -
                                                x{item.quantity}</Typography>

                                            <Stack direction={"row"} sx={{alignItems: "center"}}>
                                                <Typography variant={"body1"}
                                                            color={item.product.promotionPrice ? "success" : "textPrimary"}
                                                            sx={{fontWeight: "bold", fontSize: "1.1rem"}}
                                                >{productPrice} €</Typography>
                                                {item.product.promotionPrice &&
                                                    <Typography variant={"body1"} sx={{
                                                        color: "text.secondary",
                                                        ml: 2,
                                                        textDecoration: "line-through"
                                                    }}>{item.product.price} €</Typography>
                                                }
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid size={3.3}>
                                        <Typography variant={"caption"}
                                                    color={"textPrimary"}>{item.product.cis}</Typography>
                                        <Typography variant={"body2"}
                                                    color={"textSecondary"}>{item.product.description}</Typography>
                                    </Grid>
                                </Grid>
                                {index <= cart.length - 1 && <Divider/>}
                            </Box>

                        )
                    })
                }
                <Stack direction={"row"} spacing={2} sx={{m: 2, justifyContent: "space-between"}}>
                    <TextField
                        size={"small"}
                        label={"Code promo"}
                        error={!!promoCodeError}
                        helperText={promoCodeError}
                        onChange={(e) => setPromoCode(e.target.value)} fullWidth={true}></TextField>
                    <Button variant={"contained"} onClick={() => handlePromoCode(promoCode)}>Appliquer</Button>
                </Stack>

                <Stack direction={"column"} spacing={0.5} sx={{m: 2}}>
                    {newOrder.discount > 0 && <Stack direction={"row"} sx={{justifyContent: "space-between"}}>
                        <Typography color={"success"} variant={"body1"}>Remise :</Typography>
                        <Typography color={"success"} variant={"body1"}>{newOrder.discount}%</Typography>
                    </Stack>}
                    <Stack direction={"row"} sx={{justifyContent: "space-between"}}>
                        <Typography variant={"body1"}>Sous-total :</Typography>
                        <Typography variant={"body1"}>{totalPrice.toFixed(2)} €</Typography>
                    </Stack>
                    <Stack direction={"row"} sx={{justifyContent: "space-between"}}>
                        <Typography variant={"body1"}>Livraison :</Typography>
                        <Typography variant={"body1"}>{newOrder.deliveryPrice.toFixed(2)} €</Typography>
                    </Stack>
                    <Stack direction={"row"} sx={{justifyContent: "space-between"}}>
                        <Typography variant={"body1"} sx={{fontWeight: "1000"}}>Total :</Typography>
                        <Typography variant={"body1"}
                                    sx={{fontWeight: "1000"}}>{(totalPrice + newOrder.deliveryPrice).toFixed(2)} €</Typography>
                    </Stack>
                </Stack>
            </Paper>
            <Stack direction={"row"}
                   sx={{justifyContent: "flex-end", my: 2, gap: 1, alignContent: "center", alignItems: "center"}}>
                {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                <Button
                    variant={"contained"}
                    onClick={handleSubmit}
                >Payer {(totalPrice + newOrder.deliveryPrice).toFixed(2)} €</Button>
            </Stack>
        </>
    )
}

export default OrderSummary;