import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import axios from "axios";
import { nanoid } from "nanoid";

import "../styles/globals.css";
import { useEffect } from "react";

axios.defaults.withCredentials = true;

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("token", nanoid());
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Fund It | Fund & Help New Projects To Go To Moon</title>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default MyApp;
