import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Container, Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import Layout from "@/components/Layout";
// import GoogleIcon from "@mui/icons-material/Google";
import { GoogleIcon } from "@/assets/svgIcons";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Container>
        <Box className="w-full h-screen flex items-center justify-center">
          <Button
            variant="outlined"
            color="warning"
            onClick={() => signIn("google")}
            startIcon={<GoogleIcon />}
          >
            Login with Google
          </Button>
        </Box>
      </Container>
    );
  }
  return (
    <>
      Hello {session?.user?.name} <br />
      <Button variant="contained" color={"secondary"} onClick={() => signOut()}>
        Sign out
      </Button>
    </>
  );
}
