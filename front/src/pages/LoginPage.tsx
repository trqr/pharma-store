import LoginBox from "../features/auth/components/LoginBox.tsx";
import Stack from "@mui/material/Stack";
import ThemeSwitch from "../themes/components/ThemeSwitch.tsx";
import Box from "@mui/material/Box";

const LoginPage = () => {

    return (
        <Box sx={{height: "100vh", width: "100vw", overflow: "hidden"}}>
            <Stack direction={"row"} sx={{justifyContent: "flex-end", alignItems: "center", p: 1}}>
                <ThemeSwitch/>
            </Stack>
            <Stack
                sx={{justifyContent: "center", alignItems: "center", height: "100vh"}}
            >
                <LoginBox/>
            </Stack>
        </Box>
    )
}

export default LoginPage;