import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import "../styles/globals.css";

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Fund It | Fund & Help New Projects To Go To Moon</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
