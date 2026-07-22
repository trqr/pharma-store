import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type {Product} from "../types/product.type";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import {getProductIcon} from "../utils/productIcon.ts";
import {useCart} from "../../cart/contexts/CartContext.tsx";
import {AddShoppingCart} from "@mui/icons-material";

type ProductCardProps = {
    product: Product;
};

const ProductCard = ({product}: ProductCardProps) => {
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
                <CardActions sx={{mt: "auto", p: 2, justifyContent: "space-between"}}>
                    {product.quantity! > 0 ?
                        <>
                            <Chip variant={"outlined"} size={"small"} label={`Stock restant: ${product.quantity ?? 0}`}></Chip>
                            <Button
                                variant={"contained"}
                                size="medium"
                                onClick={() => addItem(product, 1)}
                            >Ajouter au panier <AddShoppingCart sx={{ml:  1}}/></Button>
                        </>
                        :
                        <>
                            <Chip variant={"outlined"} size={"small"} color={"error"} label={`Stock restant: ${product.quantity ?? 0}`}></Chip>
                            <Button variant={"outlined"} color={"secondary"} size="small">Me notifier</Button>
                        </>
                    }

                </CardActions>
            </Card>
        </>
    );
};

export default ProductCard;
