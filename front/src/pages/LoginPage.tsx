import LoginBox from "../features/auth/components/LoginBox.tsx";
import Stack from "@mui/material/Stack";

const LoginPage = () => {

    return (
        <Stack
            sx={{justifyContent: "center", alignItems: "center", height: "100vh"}}
        >
            <LoginBox/>
        </Stack>
    )
}

export default LoginPage;