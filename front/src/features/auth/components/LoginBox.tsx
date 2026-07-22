import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {Alert, CircularProgress, Link, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type {LoginRequest} from "../types/LoginRequest.ts";
import {LockOutlined, Person} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useAuth} from "../contexts/AuthContext.tsx";
import {type ApiError} from "../../../api/axios.type.ts";
import type {AxiosError} from "axios";

export type ValidationErrors = {
    email?: string,
    password?: string
}

const LoginBox = () => {
    const [request, setRequest] = useState<LoginRequest>({email: "", password: ""})
    const [serverError, setServerError] = useState<string>("")
    const [validateErrors, setValidateErrors] = useState<ValidationErrors>({email: "", password: ""})
    const [isRegistered, setIsRegistered] = useState<boolean>(true)
    const navigate = useNavigate();
    const {login, register, isAuthenticated, isLoading} = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
        }
    }, [isLoading]);
    const handleChange = (field: keyof LoginRequest) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setRequest(prev => ({...prev, [field]: event.target.value}))
        }

    const validate = () => {
        const newErrors: ValidationErrors = {};
        if (!request.email) {
            newErrors.email = "L'email est obligatoire";
        }
        if (request.email !== "" && !/\S+@\S+\.\S+/.test(request.email)) {
            newErrors.email = "Le format de l'email est invalide";
        }
        if (request.password.length <= 6) {
            newErrors.password = "Le mot de passe doit avoir au moins 6 caractères";
        }
        setValidateErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLogin = async () => {
        if (!validate()) return;
        try {
            const res = await login(request);
            if (res.user) {
                navigate("/")
            }
        } catch (e) {
            const error = e as AxiosError<ApiError>;
            setServerError(error.response?.data.detail ?? "Une erreur est survenue")
        }
    }

    const handleRegister = async () => {
        if (!validate()) return;
        try {
            const res = await register(request);
            if (res.user) {
                navigate("/")
            }
        } catch (e) {
            const error = e as AxiosError<ApiError>;
            setServerError(error.response?.data.detail ?? "Une erreur est survenue")
        }
    }

    return (
        <>
            {isLoading ?
                <CircularProgress/>
                :
                <Stack
                    direction={"row"}
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid black",
                        borderColor: "primary.main",
                        overflow: "hidden",
                    }}>
                    <Stack
                        sx={{
                            bgcolor: "background.default",
                            p: isRegistered ? 0 : 2,
                            justifyContent: "space-around",
                            height: 400,
                            width: isRegistered ? 0 : 500,
                            overflow: "hidden",
                            transition: "all .4s ease",
                            transform: isRegistered ? "translateX(-100%)" : "translateX(0)",
                            opacity: isRegistered ? 0 : 1,
                            visibility: isRegistered ? "hidden" : "visible",
                        }}>

                        <Stack direction={"row"}
                               sx={{justifyContent: "start", alignItems: "center", gap: 1, mb: 2}}>
                            <Person fontSize={"small"}/>
                            <Typography variant={"overline"}>Créer votre compte sur Pharma-Store</Typography>
                        </Stack>
                        <Box>
                            {
                                serverError &&
                                <Alert severity="error"
                                       onClose={() => {
                                           setServerError("")
                                       }}
                                       sx={{mb: 2}}
                                >{serverError}</Alert>
                            }
                            <Box
                                component={"form"}
                                noValidate
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    void handleLogin();
                                }}
                                sx={{display: "flex", flexDirection: "column", gap: 2, width: 460, mx: "auto"}}
                            >
                                <TextField label={"Email"}
                                           onChange={handleChange("email")}
                                           error={!!validateErrors.email}
                                           helperText={validateErrors.email}
                                           variant={"filled"}
                                ></TextField>
                                <TextField type={"password"} label={"Mot de passe"}
                                           onChange={handleChange("password")}
                                           error={!!validateErrors.password}
                                           helperText={validateErrors.password}
                                           variant={"filled"}
                                ></TextField>
                                <Button type={"submit"} variant={"contained"} onClick={handleRegister}>Créer votre compte</Button>
                                <Typography variant={"body2"}>Vous avez déja un compte
                                    ? <Link
                                        sx={{cursor: "pointer"}}
                                        onClick={() => setIsRegistered(true)}>Se connecter</Link></Typography>
                            </Box>
                        </Box>
                    </Stack>
                    <Box
                        component={"img"}
                        src={"../src/assets/pharma_login_page.png"}
                        alt={"Pharma Login Image"}
                        sx={{
                            width: 400, height: 400, bgcolor: "background.paper",
                        }}
                    />
                    <Stack
                        sx={{
                            bgcolor: "background.default",
                            p: isRegistered ? 2 : 0,
                            justifyContent: "space-around",
                            height: isRegistered ? "100%" : 0,
                            width: isRegistered ? 500 : 0,
                            overflow: "hidden",
                            transition: "all .4s ease",
                            transform: isRegistered ? "translateX(0)" : "translateX(100%)",
                            opacity: isRegistered ? 1 : 0,
                            visibility: isRegistered ? "visible" : "hidden",
                        }}>
                        <Stack direction={"row"}
                               sx={{justifyContent: "start", alignItems: "center", gap: 1, mb: 2}}>
                            <LockOutlined fontSize={"small"}/>
                            <Typography variant={"overline"}>Se connecter à Pharma-Store</Typography>
                        </Stack>
                        <Box>
                            {
                                serverError &&
                                <Alert severity="error"
                                       onClose={() => {
                                           setServerError("")
                                       }}
                                       sx={{mb: 2}}
                                >{serverError}</Alert>
                            }
                            <Box
                                component={"form"}
                                noValidate
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    void handleLogin();
                                }}
                                sx={{display: "flex", flexDirection: "column", width: 450,gap: 2, mx: "auto"}}
                            >
                                <TextField label={"Email"}
                                           onChange={handleChange("email")}
                                           error={!!validateErrors.email}
                                           helperText={validateErrors.email}
                                           variant={"filled"}
                                ></TextField>
                                <TextField type={"password"} label={"Mot de passe"}
                                           onChange={handleChange("password")}
                                           error={!!validateErrors.password}
                                           helperText={validateErrors.password}
                                           variant={"filled"}
                                ></TextField>
                                <Button type={"submit"} variant={"contained"} onClick={handleLogin}>Se
                                    connecter</Button>
                                <Typography variant={"body2"}>Pas de compte
                                    ? <Link
                                        sx={{cursor: "pointer"}}
                                        onClick={() => setIsRegistered(false)}>S'enregistrer</Link></Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Stack>
            }

        </>
    )
}

export default LoginBox;
