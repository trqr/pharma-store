import {useAuth} from "../features/auth/contexts/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import {type ReactNode} from "react";
import {CircularProgress} from "@mui/material";
import Stack from "@mui/material/Stack";

interface ProtectedRouteProps {
    roles: string[];
    children: ReactNode;
}

const ProtectedRoute = ({roles, children}: ProtectedRouteProps) => {
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return (
            <Stack sx={{justifyContent: "center", alignItems: "center", height: "100vh"}}>
                <CircularProgress size={60}/>
            </Stack>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

export default ProtectedRoute;