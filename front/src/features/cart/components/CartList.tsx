import {useCart} from "../contexts/CartContext.tsx";
import type {CartItem} from "../types/cart.type.ts";
import {Badge, Box, Divider, IconButton, List, ListItem, ListItemText, Menu, Paper} from "@mui/material";
import {RemoveCircle, ShoppingCartOutlined} from "@mui/icons-material";
import {type MouseEvent, useState} from "react";
import {getProductIcon} from "../../products/utils/productIcon.ts";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const CartList = () => {
    const {cart, totalQuantity, totalPrice, removeItem} = useCart();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = () => {
        navigate("/checkout");
        handleClose();
    }

    return (
        <Box>
            <IconButton onClick={handleClick}
            >
                <Badge color={"error"} badgeContent={totalQuantity}>
                    <ShoppingCartOutlined color={"primary"}/>
                </Badge>
            </IconButton>
            <Menu
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Typography variant={"h6"} sx={{ml: 3, mb: 1, minWidth: 500}}>Votre panier</Typography>
                <Divider variant={"middle"}></Divider>

                {cart.length === 0 ?
                    (<Typography variant={"body1"} sx={{m: 1}}>Pas d'articles dans le panier</Typography>)
                    :
                    <>
                        <List>
                            {cart.map((item: CartItem) => {
                                    const Icon = getProductIcon(item.product.description);

                                    return (
                                        <ListItem
                                            key={item.id}
                                            secondaryAction={
                                                <IconButton>
                                                    <RemoveCircle
                                                        color={"error"}
                                                        onClick={() => removeItem(item.id)}
                                                    />
                                                </IconButton>
                                            }
                                        >
                                            <Icon fontSize={"medium"} color="info" sx={{mr: 1}}/>
                                            <ListItemText primary={item.product.name}
                                                          secondary={`Qté: ${item.quantity} - Prix: ${(item.product.promotionPrice ?? item.product.price ?? 0) * item.quantity} €`}
                                            />
                                        </ListItem>
                                    );
                                }
                            )}
                        </List>
                        <Paper variant={"outlined"} sx={{p: 1, m: 1}}>
                            <Stack direction={"row"} sx={{justifyContent: "space-between", alignItems: "center"}}>
                                <Stack direction={"row"} sx={{gap: 1}}>
                                    <Typography variant={"body1"}>Quantité : {totalQuantity}</Typography>
                                    <Divider orientation={"vertical"} flexItem></Divider>
                                    <Typography variant={"body1"}>Total : {totalPrice.toFixed(2)} €</Typography>
                                </Stack>
                                <Button
                                    size="large"
                                    variant={"contained"}
                                    onClick={handleSubmit}
                                >
                                    Valider
                                </Button>
                            </Stack>
                        </Paper>
                    </>
                }


            </Menu>
        </Box>
    )
}

export default CartList;