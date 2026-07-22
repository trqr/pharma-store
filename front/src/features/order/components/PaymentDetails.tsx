import {useState} from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {orderPayment} from "../api/orders.api.ts";
import {useOrder} from "../contexts/OrderContext.tsx";
import type {AxiosError} from "axios";
import type {ApiError} from "../../../api/axios.type.ts";

type PaymentMethod = "card" | "bank_transfer" | "cash";

const PaymentDetails = () => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const {newOrder} = useOrder();

    const handlePayment = async () => {
        setProcessing(true);
        setError("");
        setSuccess(false);

        if (paymentMethod === "card") {
            if (!cardNumber || !cardName || !expiryDate || !cvv) {
                setError("Veuillez remplir tous les champs");
                setProcessing(false);
                return;
            }
            try {
                const response = await orderPayment(
                    {orderId: newOrder.id,
                        creditCardNumber: cardNumber.replaceAll(" ", ""),
                        creditCardExpirationDate: expiryDate,
                        creditCardCvv: cvv,
                        paymentMethodId: 2,
                        paymentAmount: newOrder.totalPrice
                    })
                setSuccess(response.success);
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                setError(error.response?.data.detail ?? "Le paiement a echoue");
                setProcessing(false);
                return;
            }
        }

        setProcessing(false);
    };

    const formatCardNumber = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        const limited = numbers.slice(0, 16);
        return limited.replace(/(\d{4})/g, "$1 ").trim();
    };

    const formatExpiryDate = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length >= 2) {
            return numbers.slice(0, 2) + "/" + numbers.slice(2, 4);
        }
        return numbers;
    };

    return (
        <Box sx={{pt: 2, px: 1.5, width: "100%", bgcolor: "background.paper", borderRadius: "4px", height: "100%"}}>
            <Stack direction={"column"} sx={{mb: 3}}>
                <Typography variant={"h5"} color={"textPrimary"}>Méthode de paiement</Typography>
                <Typography variant={"body2"} color={"textSecondary"}>Choisissez votre mode de paiement</Typography>
            </Stack>

            <FormControl component="fieldset" sx={{mb: 3, width: "100%"}}>
                <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                    <Paper elevation={0} sx={{mb: 1, border: 1, borderColor: paymentMethod === "card" ? "primary.main" : "divider"}}>
                        <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
                                    <CreditCardIcon />
                                    <Typography>Carte bancaire</Typography>
                                </Stack>
                            }
                            sx={{py: 1, px: 2, width: "100%", m: 0}}
                        />
                    </Paper>

                    <Paper elevation={0} sx={{mb: 1, border: 1, borderColor: paymentMethod === "bank_transfer" ? "primary.main" : "divider"}}>
                        <FormControlLabel
                            value="bank_transfer"
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
                                    <AccountBalanceIcon />
                                    <Typography>Virement bancaire</Typography>
                                </Stack>
                            }
                            sx={{py: 1, px: 2, width: "100%", m: 0}}
                        />
                    </Paper>

                    <Paper elevation={0} sx={{border: 1, borderColor: paymentMethod === "cash" ? "primary.main" : "divider"}}>
                        <FormControlLabel
                            value="cash"
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} sx={{alignItems: "center"}}>
                                    <LocalAtmIcon />
                                    <Typography>Paiement à la livraison</Typography>
                                </Stack>
                            }
                            sx={{py: 1, px: 2, width: "100%", m: 0}}
                        />
                    </Paper>
                </RadioGroup>
            </FormControl>

            {paymentMethod === "card" && (
                <Stack spacing={2} sx={{mb: 3}}>
                    <TextField
                        fullWidth
                        label="Numéro de carte"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        helperText="Test: 4000000000000002 (échec)"
                    />
                    <TextField
                        fullWidth
                        label="Nom sur la carte"
                        placeholder="Jean Dupont"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                    />
                    <Grid container spacing={2}>
                        <Grid size={{xs: 6}}>
                            <TextField
                                fullWidth
                                label="Date d'expiration"
                                placeholder="MM/AA"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            />
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <TextField
                                fullWidth
                                label="CVV"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                type="password"
                            />
                        </Grid>
                    </Grid>
                </Stack>
            )}

            {paymentMethod === "bank_transfer" && (
                <Alert severity="info" sx={{mb: 3}}>
                    Vous recevrez les instructions de virement par email après validation de la commande.
                </Alert>
            )}

            {paymentMethod === "cash" && (
                <Alert severity="info" sx={{mb: 3}}>
                    Vous pourrez payer en espèces lors de la réception de votre commande.
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{mb: 2}}>
                    Paiement validé avec succès !
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}

            <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePayment}
                disabled={processing}
                sx={{mb: 3}}
            >
                {processing ? "Traitement en cours..." : "Valider le paiement"}
            </Button>
        </Box>
    )
}

export default PaymentDetails;
