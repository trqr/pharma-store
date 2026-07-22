import {startTransition, useEffect, useState} from "react";
import type {Product} from "../types/product.type";
import ProductCard from "./ProductCard";
import {emptyPaginedRes, type PaginatedResponse,} from "../types/paginatedResponse.type";
import {getProducts} from "../api/product.api";
import Grid from "@mui/material/Grid";
import {Search} from "@mui/icons-material";
import {IconButton, InputBase, ListItemIcon, ListItemText, MenuItem, Pagination, Paper, Select} from "@mui/material";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MedicationIcon from "@mui/icons-material/Medication";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ScienceIcon from "@mui/icons-material/Science";
import Stack from "@mui/material/Stack";

const ProductTable = () => {
    const [search, setSearch] = useState<string>("")
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [medicineType, setMedicineType] = useState<string>("")
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(6)
    const [paginatedResponse, setPaginatedResponse] =
        useState<PaginatedResponse>(emptyPaginedRes);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        startTransition(async () => {
            const fetchedProducts = await getProducts(page, limit, debouncedSearch);
            setPaginatedResponse(fetchedProducts);
        });
    }, [debouncedSearch, page, limit]);

    return (
        <>
            <Paper sx={{p: '2px 4px', my: 2, display: 'flex', alignItems: 'center', width: 400}}>
                <Select
                    value={medicineType}
                    onChange={(e) => setMedicineType(e.target.value)}
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
                            case "comprime":
                                return <MedicationIcon color="primary"/>;
                            case "gelule":
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
                    <MenuItem value="comprime">
                        <ListItemIcon>
                            <MedicationIcon color="primary"/>
                        </ListItemIcon>
                        <ListItemText>Comprimé</ListItemText>
                    </MenuItem>
                    <MenuItem value="gelule">
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
                    onChange={(e) => setSearch(e.target.value)}
                />

                <IconButton onClick={() => setSearch(search)}>
                    <Search/>
                </IconButton>
            </Paper>

            <Stack
                direction={"row"}
                sx={{justifyContent: "center", alignItems: "center", mt: 2, gap: 2, mb: 2, position: "relative"}}>
                <Pagination
                    variant={"outlined"}
                    shape="rounded"
                    count={paginatedResponse.pagination.pages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                ></Pagination>
                <Select
                    size={"small"}
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    sx={{mx: 2, position: "absolute", right: -15}}
                >
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={60}>60</MenuItem>
                </Select>
            </Stack>

            <Grid container spacing={1.5}>
                {paginatedResponse.data.map((product: Product) => (
                    <Grid key={product.id} size={{xs: 6, md: 4, xl: 4}}>
                        <ProductCard product={product}/>
                    </Grid>
                ))}
            </Grid>
            <Stack direction={"row"} sx={{justifyContent: "center", alignItems: "center", mt: 2, gap: 2, mb: 2}}>
                <Pagination
                    variant={"outlined"}
                    shape="rounded"
                    count={paginatedResponse.pagination.pages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                ></Pagination>
            </Stack>

        </>
    );
};

export default ProductTable;
