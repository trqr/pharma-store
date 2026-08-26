import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type {Product} from "../types/product.type";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import {getProductIcon} from "../utils/productIcon.ts";
import {useCart} from "../../cart/contexts/CartContext.tsx";
import {AddShoppingCart} from "@mui/icons-material";
import {Chip, TextField} from "@mui/material";
import {useState} from "react";

type ProductCardProps = {
    product: Product;
};

const ProductCard = ({product}: ProductCardProps) => {
    const [quantity, setQuantity] = useState<number>(1)
    const {addItem} = useCart();

    const Icon = getProductIcon(product.description);

    return (
        <>
            <Card sx={{
                minWidth: 275, minHeight: 360, display: "flex",
                flexDirection: "column",
            }}>
                <CardContent sx={{flexGrow: 1}}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 2}}>
                        <Icon fontSize="large" color={"info"}></Icon>
                        <Typography variant="h6"
                                    component="div"
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>
                            {product.name}
                        </Typography>
                    </Box>

                    <Typography sx={{color: "text.secondary", mb: 1}}>
                        <strong>CIS:</strong> {product.cis}
                    </Typography>

                    <Typography sx={{color: "text.secondary", mb: 1}}>
                        <strong>Description:</strong> {product.description}
                    </Typography>

                    <Typography sx={{color: "text.secondary", mb: 1}}>
                        <strong>Substances actives:</strong> {product.activeSubstances}
                    </Typography>

                    <Box sx={{display: "flex", gap: 1, mb: 1, flexWrap: "wrap"}}>
                        <Chip
                            label={`Groupe: ${product.genericGroup}`}
                            color="default"
                            size="small"
                        />
                    </Box>
                </CardContent>
                <Stack direction={"row"} sx={{justifyContent: "center", alignItems: "center"}}>
                    {
                        product.promotionPrice ?
                            <>
                                <Typography variant={"h5"} sx={{ textDecoration: "line-through", p: 1}}>{`${product.price}€`}</Typography>
                                <Typography variant={"h4"} color={"success"} sx={{ p: 1}}>{`${product.promotionPrice}€`}</Typography>
                            </>
                        :
                            <>
                                <Typography variant={"h4"} sx={{ p: 1}}>{`${product.price}€`}</Typography>
                            </>
                    }
                </Stack>
                <CardActions sx={{mt: "auto", gap: 1, p: 2, justifyContent: "flex-end"}}>
                    {product.quantity! > 0 ?
                        <>
                            {product.quantity! < 10 &&
                            <Chip variant={"outlined"} size={"small"} color={"warning"} label={`Plus que ${product.quantity} disponible`}></Chip>
                            }
                            <TextField
                                sx={{width: "35%"}}
                                size={"small"}
                                variant={"outlined"}
                                label={"Quantité"}
                                type={"number"}
                                value={quantity}
                                error={quantity<0}
                                helperText={quantity<0 ? "Doit être positif" : ""}
                                onChange={(event) => setQuantity(Number(event.target.value))}
                            />
                            <Button
                                variant={"contained"}
                                size="medium"
                                sx={{gap: 1}}
                                onClick={() => addItem(product, quantity)}
                                disabled={quantity < 1}
                            >Ajouter {quantity} <AddShoppingCart fontSize={"small"}/></Button>
                        </>
                        :
                        <>
                            <Chip variant={"outlined"} size={"small"} color={"error"} label={`En rupture`}></Chip>
                            <Button variant={"text"} color={"secondary"} size="small">Me notifier le réassort</Button>
                        </>
                    }

                </CardActions>
            </Card>
        </>
    );
};

export default ProductCard;
