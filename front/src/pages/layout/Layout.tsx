import Container from "@mui/material/Container";
import {Outlet} from "react-router-dom";
import Header from "./Header.tsx";

const Layout = () => {
  return (
    <>
      <Container fixed >
        <Header/>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
