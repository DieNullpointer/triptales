import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-tailwind/react";
import SideBar from "@/components/SideBar";
import Grid from "@/components/atoms/Grid";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={"text-slate-800 font-roboto flex"}>
      <div className="sticky top-0 h-screen">
        <SideBar />
      </div>
      <div className="p-6 w-full">
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </div>
    </div>
  );
}
