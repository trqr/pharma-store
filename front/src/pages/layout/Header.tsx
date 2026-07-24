import {Avatar, IconButton, Menu, MenuItem, Toolbar, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useState} from "react";
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeSwitch from "../../themes/components/ThemeSwitch.tsx";
import {useAuth} from "../../features/auth/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import CartList from "../../features/cart/components/CartList.tsx";
import {useColorScheme} from "@mui/material/styles";
import medicineLogo from "../../assets/medicine.png";
import pharmacyLogo from "../../assets/pharmacy.png";


const pages = ['Products', 'Pricing', 'Blog'];
const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const {logout} = useAuth();
    const navigate = useNavigate();
    const {mode} = useColorScheme();


    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <Toolbar disableGutters sx={{mt: 2, mb: 5}}>
            <Box
                component="img"
                src={mode === "light" ? medicineLogo : pharmacyLogo}
                alt="Logo"
                onClick={() => navigate("/")}
                sx={{
                    width: 35,
                    height: 35,
                    display: {xs: 'none', md: 'flex'},
                    mr: 2,
                    cursor: "pointer"
                }}
            />
            <Typography
                variant="h5"
                noWrap
                component="a"
                color={"textPrimary"}
                onClick={() => navigate("/")}
                sx={{
                    mr: 2,
                    display: {xs: 'none', md: 'flex'},
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                }}
            >
                PHARMA-STORE
            </Typography>

            <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                    <MenuIcon/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{display: {xs: 'block', md: 'none'}}}
                >
                    {pages.map((page) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                            <Typography sx={{textAlign: 'center'}}>{page}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
            <Typography
                variant="h5"
                noWrap
                component="a"
                onClick={() => navigate("/")}
                sx={{
                    mr: 2,
                    display: {xs: 'flex', md: 'none'},
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                LOGO
            </Typography>
            <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                {pages.map((page) => (
                    <Button
                        color={"inherit"}
                        key={page}
                        onClick={handleCloseNavMenu}
                        sx={{my: 2, display: 'block'}}
                    >
                        {page}
                    </Button>
                ))}
            </Box>
            <Box sx={{flexGrow: 0, display: "flex", gap: 2, alignItems: "center"}}>
                <ThemeSwitch/>
                <CartList/>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{mt: '45px'}}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem onClick={() => navigate("/user/orders") }>
                        <Typography sx={{textAlign: 'center'}}>Commandes</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <Typography sx={{textAlign: 'center'}}>Se déconnecter</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Toolbar>
    )
}

export default Header;