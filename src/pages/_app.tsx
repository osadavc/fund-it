import type { AppProps } from "next/app";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";

import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Head>
        <title>Fund It | Fund & Help New Projects To Go To Moon</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
