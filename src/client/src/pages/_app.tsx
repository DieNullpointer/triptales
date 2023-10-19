import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-tailwind/react";
import SideBar from "@/components/static/SideBar";
import Button from "@/components/atoms/Button";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Drawer from "@/components/static/Drawer";
import { Subheading } from "@/components/atoms/Text";
//import { m } from "framer-motion";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className={"text-slate-800 font-roboto flex w-full"}>
      {router.asPath.includes("landingpage") ? (
        <div className="w-full">
          <Component {...pageProps} />
        </div>
      ) : (
        <>
          <Drawer open={modalOpen} onClose={() => setModalOpen(false)} />
          <div className="sticky top-0 h-screen">
            <SideBar className="hidden md:block" />
          </div>
          <div className="p-6 w-full">
            <ThemeProvider>
              <div className="flex md:hidden flex-row space-x items-center relative mb-4">
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-inherit shadow-none !p-3 hover:bg-slate-100/50"
                >
                  <Bars3Icon className="h-6 w-6 text-slate-900" />
                </Button>
                <Subheading uppercase bold wide center>
                  navigation
                </Subheading>
              </div>
              <Component {...pageProps} />
            </ThemeProvider>
          </div>
        </>
      )}
    </div>
  );
}
