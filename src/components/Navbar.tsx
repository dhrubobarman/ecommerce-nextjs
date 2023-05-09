import React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Link from "next/link";
import { Avatar, Box, Chip, useMediaQuery } from "@mui/material";
import { useSession } from "next-auth/react";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface NavbarInterface {
  open: boolean;
  handleDrawerOpen: () => void;
}

export default function MiniDrawer({
  open,
  handleDrawerOpen,
}: NavbarInterface) {
  const { data: user } = useSession();
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Link href={"/"}>
          <Typography variant="h6" noWrap component="h2">
            <StorefrontIcon sx={{ verticalAlign: "text-bottom" }} /> Ecommerce
            Admin
          </Typography>
        </Link>
        {user ? (
          <Box
            ml="auto"
            sx={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <IconButton>
              <Avatar
                alt={user?.user?.name || "User Image"}
                src={`${user?.user?.image}`}
              />
            </IconButton>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
