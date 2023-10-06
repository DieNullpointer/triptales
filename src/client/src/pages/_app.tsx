import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-tailwind/react";
import SideBar from "@/components/static/SideBar";
import Button from "@/components/atoms/Button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Drawer from "@/components/static/Drawer";

export default function App({ Component, pageProps }: AppProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <div className={"text-slate-800 font-roboto flex w-full"}>
      <Drawer open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="sticky top-0 h-screen">
        <SideBar className="hidden md:block" />
      </div>
      <div className="p-6 w-full">
        <ThemeProvider>
          <Button
            onClick={() => setModalOpen(true)}
            className="block md:hidden bg-inherit shadow-none !p-4 hover:bg-slate-100/50"
          >
            <Bars3Icon className="h-5 w-5 text-slate-900" />
          </Button>
          <Component {...pageProps} />
        </ThemeProvider>
      </div>
    </div>
  );
}
