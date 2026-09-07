import {useEffect, useState} from "react";
import type {Product} from "../types/product.type";
import ProductCard from "./ProductCard";
import Grid from "@mui/material/Grid";
import {Search} from "@mui/icons-material";
import {
    CircularProgress,
    IconButton,
    InputBase,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Typography,
} from "@mui/material";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MedicationIcon from "@mui/icons-material/Medication";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ScienceIcon from "@mui/icons-material/Science";
import Stack from "@mui/material/Stack";
import {fetchProducts, setLimit, setMedicineType, setPage, setSearch} from "../store/productsSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const ProductTable = () => {
    const dispatch = useDispatch();

    // Lecture du catalogue depuis Redux (plus de useState pour la liste / pagination)
    const {items, pagination: paginationMeta, page, limit, search, medicineType, status, error} = useSelector(
        (state) => state.products,
    );

    const [searchInput, setSearchInput] = useState<string>(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setSearch(searchInput));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput, dispatch]);

    useEffect(() => {
        dispatch(fetchProducts({page, limit, search, medicineType}));
    }, [dispatch, page, limit, search, medicineType]);


    const pagination = (
        <Pagination
            variant="text"
            shape="rounded"
            count={paginationMeta.pages}
            page={page}
            onChange={(_, value) => dispatch(setPage(value))}
        />
    );

    return (
        <>
            <Stack
                direction={"row"}
                sx={{justifyContent: "center", alignItems: "center", mt: 2, gap: 2, mb: 2, position: "relative"}}>
                <Paper sx={{ display: 'flex', alignItems: 'center', width: 320, position: "absolute", left: 0}}>
                    <Select
                        value={medicineType}
                        onChange={(e) => dispatch(setMedicineType(e.target.value))}
                        displayEmpty
                        variant="standard"
                        disableUnderline
                        sx={{
                            mx: 1,
                            minWidth: 50,
                            '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                paddingTop: '8px',
                                paddingBottom: '8px'
                            }
                        }}
                        renderValue={(selected) => {
                            if (!selected) return <LocalPharmacyIcon/>;
                            switch (selected) {
                                case "comprimé":
                                    return <MedicationIcon color="primary"/>;
                                case "gélule":
                                    return <LocalPharmacyIcon color="secondary"/>;
                                case "solution":
                                    return <VaccinesIcon color="error"/>;
                                case "suspension":
                                    return <WaterDropIcon color="info"/>;
                                case "poudre":
                                    return <ScienceIcon color="warning"/>;
                                default:
                                    return <LocalPharmacyIcon/>;
                            }
                        }}
                    >
                        <MenuItem value="">
                            <ListItemIcon>
                                <LocalPharmacyIcon/>
                            </ListItemIcon>
                            <ListItemText>Tous</ListItemText>
                        </MenuItem>
                        <MenuItem value="comprimé">
                            <ListItemIcon>
                                <MedicationIcon color="primary"/>
                            </ListItemIcon>
                            <ListItemText>Comprimé</ListItemText>
                        </MenuItem>
                        <MenuItem value="gélule">
                            <ListItemIcon>
                                <LocalPharmacyIcon color="secondary"/>
                            </ListItemIcon>
                            <ListItemText>Gélule</ListItemText>
                        </MenuItem>
                        <MenuItem value="solution">
                            <ListItemIcon>
                                <VaccinesIcon color="error"/>
                            </ListItemIcon>
                            <ListItemText>Solution/Perfusion</ListItemText>
                        </MenuItem>
                        <MenuItem value="suspension">
                            <ListItemIcon>
                                <WaterDropIcon color="info"/>
                            </ListItemIcon>
                            <ListItemText>Suspension/Buvable</ListItemText>
                        </MenuItem>
                        <MenuItem value="poudre">
                            <ListItemIcon>
                                <ScienceIcon color="warning"/>
                            </ListItemIcon>
                            <ListItemText>Poudre/Granulés</ListItemText>
                        </MenuItem>
                    </Select>
                    <InputBase
                        sx={{ml: 1, flex: 1}}
                        fullWidth={true}
                        placeholder={"Recherche un médicament"}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />

                    <IconButton onClick={() => dispatch(setSearch(searchInput))}>
                        <Search fontSize={"small"}/>
                    </IconButton>
                </Paper>
                {pagination}
                <Select
                    size={"small"}
                    value={limit}
                    onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
                    sx={{mx: 2, position: "absolute", right: -15}}
                >
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={60}>60</MenuItem>
                </Select>
            </Stack>

            {status === "loading" && (
                <Stack direction="row" sx={{justifyContent: "center", my: 4}}>
                    <CircularProgress/>
                </Stack>
            )}
            {status === "failed" && (
                <Typography color="error" sx={{textAlign: "center", my: 2}}>
                    {error}
                </Typography>
            )}
            <Grid container spacing={1.5}>
                {items.map((product: Product) => (
                    <Grid key={product.id} size={{xs: 6, md: 4, xl: 4}}>
                        <ProductCard product={product}/>
                    </Grid>
                ))}
            </Grid>
            <Stack direction={"row"} sx={{justifyContent: "center", alignItems: "center", mt: 2, gap: 2, mb: 2}}>
                {pagination}
            </Stack>

        </>
    );
};

export default ProductTable;
