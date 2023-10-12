import { cleanClasses } from "@/helpers/stringHelpers";
import React from "react";

export interface Props {
  children: React.ReactElement[] | React.ReactElement;
  className?: string;
  center?: boolean;
  id?: string;
  sectionMarker?: boolean;
}

const Container: React.FC<Props> = ({
  id = "",
  center,
  className = "",
  children,
  sectionMarker
}) => (
  <div
    id={id}
    className={cleanClasses(
      `${center ? "justify-center items-center" : ""} ${
        sectionMarker ? "bg-slate-100 p-2 rounded-lg" : ""
      } ${className}`
    )}
  >
    {children}
  </div>
);
export default Container;
