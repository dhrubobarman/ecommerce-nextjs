import "@/styles/globals.css";
import { useContext, useState } from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { darkTheme } from "@/styles/theme";
import Layout from "@/components/Layout";
import {
  CustomToastContextProvider,
  ToastDataType,
} from "@/lib/CustomToastContext";
import CustomToast from "@/lib/CustomToast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [toastConfig, setToastConfig] = useState<ToastDataType>({
    open: false,
    message: "",
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <SessionProvider session={session}>
        <CustomToastContextProvider value={[toastConfig, setToastConfig]}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {toastConfig.open && (
            <CustomToast
              type={toastConfig.type || "success"}
              message={toastConfig.message}
              anchorOrigin={
                toastConfig?.anchorOrigin || {
                  vertical: "top",
                  horizontal: "center",
                }
              }
              open={toastConfig.open}
              close={() => {
                setToastConfig({ open: false, message: "" });
              }}
            />
          )}
        </CustomToastContextProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
