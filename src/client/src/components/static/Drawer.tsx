import React from "react";
import { Flowtext } from "../atoms/Text";
import { Drawer as TDrawer } from "@material-tailwind/react";
import MenuProvider from "./MenuProvider";

export interface Props {
  open: boolean;
  onClose: () => void;
}

const Drawer: React.FC<Props> = ({ open = false, onClose }) => {
  const itemsClass =
    "text-white hover:bg-primary/20 active:focus:bg-primary/20 focus:bg-primary/20 hover:text-white focus:text-white active:text-white";

  return (
    <React.Fragment>
      <TDrawer
        open={open}
        onClose={onClose}
        className="bg-primaryHover/60 text-white"
      >
        <div className="mb-2 p-4 w-full">
          <Flowtext uppercase wide center bold>
            Navigation
          </Flowtext>
        </div>
        <MenuProvider />
      </TDrawer>
    </React.Fragment>
  );
};

export default Drawer;
