import {useEffect, useState, useTransition} from "react";
import type {Address} from "../types/address.type.ts";
import {addUserAddress, getUserAddresses} from "../api/address.api.ts";
import Card from "@mui/material/Card";
import {useOrder} from "../contexts/OrderContext.tsx";
import {
    CardActionArea,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    TextField
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {AddBox, DisabledByDefault} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const AddressSection = () => {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState<boolean>(false)
    const [newAddress, setNewAddress] = useState<Address>({
        name: "",
        address: "",
        zip: 0,
        city: "",
    })
    const {newOrder, setNewOrder} = useOrder()

    useEffect(() => {
        startTransition(async () => {
            const fetchedAddresses = await getUserAddresses()
            setAddresses(fetchedAddresses)
        })
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (name === "zip") {
            return setNewAddress((prev) => ({...prev, [name]: parseInt(value)}));
        }
        setNewAddress((prev) => ({...prev, [name]: value}));
    }

    const handleSubmit = () => {
        startTransition(async () => {
            const newAddressId = await addUserAddress(newAddress);
            setAddresses((prev) => [...prev, {...newAddress, id: newAddressId.id}]);
            handleClose();
        })
    }

    const handleAddressSelect = (addressId: number) => {
        setNewOrder({...newOrder, deliveryAddressId: addressId})
    }

    return (
        <>
            <Stack direction={"column"} sx={{mb: 2, pt: 2}}>
                <Typography variant={"h5"} color={"textPrimary"}>Planifier votre livraison</Typography>
                <Typography variant={"body2"} color={"textSecondary"}>Ajouter et choisissez une adresse de livraison et un mode de livraison.</Typography>
            </Stack>
            <Divider/>
            <Stack direction={"row"} sx={{justifyContent: "space-between", pt: 2}}>
                <Typography variant={"body1"}>Choisissez une addresse de livraison</Typography>
                <IconButton size={"medium"} onClick={handleOpen}>
                    <AddBox fontSize={"medium"} color={"primary"}></AddBox>
                </IconButton>
            </Stack>
            <Grid container spacing={1}>
                {isPending ? <div>Loading...</div> :
                    addresses.map((address) => (
                        <Grid key={address.id!} size={4}>
                            <Card
                                variant="outlined"
                                sx={(theme) => ({
                                    minHeight: "100%",
                                    position: "relative",
                                    border: newOrder.deliveryAddressId === address.id
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : `2px solid ${theme.palette.grey[100]}`,
                                    transition: "all 0.3s ease-in-out",
                                    bgcolor: newOrder.deliveryAddressId === address.id
                                        ? "action.selected.light"
                                        : `${theme.palette.background.default}`,
                                })}

                            >
                                <CardActionArea
                                    onClick={() => handleAddressSelect(address.id!)}
                                >
                                    <CardHeader
                                        subheader={address.name}
                                        sx={{pb: 0}}
                                    >
                                    </CardHeader>
                                    <CardContent>
                                        <Typography variant={"body2"}>{address.address}</Typography>
                                        <Typography variant={"body2"}>{address.zip} <b>{address.city}</b></Typography>
                                    </CardContent>
                                </CardActionArea>
                                <IconButton size={"small"} sx={{position: "absolute", top: 0, right: 0}}>
                                    <DisabledByDefault color={"action"} fontSize={"small"}/>
                                </IconButton>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                fullWidth={true}
            >
                <DialogTitle variant={"h5"}>Ajouter une nouvelle adresse</DialogTitle>
                <DialogContent>
                    <Stack direction={"column"} spacing={2}>
                        <TextField name="name" label={"Nom"} onChange={handleAddressChange}></TextField>
                        <TextField name="address" label={"Adresse"} onChange={handleAddressChange}></TextField>
                        <TextField name="zip" type="number" label={"Code postal"} onChange={handleAddressChange}></TextField>
                        <TextField name="city" label={"Ville"} onChange={handleAddressChange}></TextField>
                    </Stack>

                    <DialogContent>
                        <Stack direction={"row"} spacing={3} sx={{justifyContent: "flex-end"}}>
                            <Button variant={"outlined"} onClick={handleClose}>Annuler</Button>
                            <Button variant={"contained"} onClick={handleSubmit}>Ajouter</Button>
                        </Stack>
                    </DialogContent>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddressSection;