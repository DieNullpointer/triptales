import { cleanClasses } from "@/helpers/stringHelpers";
import React from "react";

export interface Props {
  children: React.ReactElement[];
  cols: number;
  expandCols?: number;
  className?: string;
  itemClass?: string;
  even?: boolean;
}

const Grid: React.FC<Props> = ({
  children,
  cols,
  expandCols,
  className,
  itemClass,
  even,
}) => {
  const classNames = cleanClasses(
    `!grid !grid-flow-col ${cols ? "grid-cols-" + cols : "grid-cols-1"} ${
      expandCols ? "md:grid-cols-" + expandCols + "" : ""
    } ${even ? "auto-cols-fr" : ""} ${className}`
  );
  if (!itemClass) return <div className={classNames}>{...children}</div>;
  else
    return (
      <div className={classNames}>
        {children.map((child) => (
          <div className={itemClass}>{child}</div>
        ))}
      </div>
    );
};
export default Grid;
