import { Card } from "@material-tailwind/react";
import React from "react";
import { Flowtext } from "../atoms/Text";
import MenuProvider from "./MenuProvider";

const SideBar: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <Card
      className={
        "h-screen w-full max-w-xs bg-primaryHover !text-white !rounded-none p-4 border-r border-gray-100/80 " +
        className
      }
    >
      <div className="mb-2 p-4 w-full">
        <Flowtext uppercase wide center bold>
          Navigation
        </Flowtext>
      </div>
      <MenuProvider />
    </Card>
  );
};

export default SideBar;
