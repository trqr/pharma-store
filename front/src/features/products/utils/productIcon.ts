import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MedicationIcon from "@mui/icons-material/Medication";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ScienceIcon from "@mui/icons-material/Science";

export const getProductIcon = (description: string) => {
    const desc = description.toLowerCase();

    if (desc.includes("comprimé") || desc.includes("pelliculé")) {
        return MedicationIcon;
    }

    if (desc.includes("gélule") || desc.includes("capsule")) {
        return LocalPharmacyIcon;
    }

    if (
        desc.includes("solution") ||
        desc.includes("perfusion") ||
        desc.includes("injectable")
    ) {
        return VaccinesIcon;
    }

    if (
        desc.includes("suspension") ||
        desc.includes("buvable") ||
        desc.includes("sirop")
    ) {
        return WaterDropIcon;
    }

    if (
        desc.includes("poudre") ||
        desc.includes("granulés")
    ) {
        return ScienceIcon;
    }

    return LocalPharmacyIcon;
};