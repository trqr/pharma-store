import ProductTable from "../features/products/components/ProductTable";
import Typography from "@mui/material/Typography";

const HomePage = () => {
    return (
        <>
            <Typography variant={"h4"}>Votre pharmacie en ligne</Typography>
            <ProductTable/>
        </>
    )
}

export default HomePage;