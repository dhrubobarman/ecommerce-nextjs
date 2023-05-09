import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSession } from "next-auth/react";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface layoutProps extends React.ButtonHTMLAttributes<HTMLDivElement> {}

export default function Layout({ children, ...others }: layoutProps) {
  const { data: session } = useSession();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return session ? (
    <Box sx={{ display: "flex" }}>
      <Navbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Sidebar
        handleDrawerClose={handleDrawerClose}
        theme={theme}
        open={open}
      />
      <Box component="main" sx={{ p: 3 }} className="w-full" {...others}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  ) : (
    <>{children}</>
  );
}
