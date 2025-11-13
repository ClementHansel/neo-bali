import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { useLenisScroll } from "@/hooks/useLenisScroll";

export default function App({ Component, pageProps }: AppProps) {
  // Activate smooth scrolling globally
  useLenisScroll();

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
