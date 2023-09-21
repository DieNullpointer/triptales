import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, Roboto } from 'next/font/google'

const roboto = Roboto({subsets: ['latin'], weight: '400'})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={roboto.className + " p-6 text-slate-800"}>
      <Component {...pageProps} />
    </div>
  );
}
