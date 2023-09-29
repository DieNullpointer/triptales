import { cleanClasses } from "@/helpers/helpers";
import React from "react";

export interface Props {
  children: React.ReactElement[];
  cols: number;
  expandCols?: number;
  className?: string;
  itemClass?: string;
}

const Grid: React.FC<Props> = ({
  children,
  cols,
  expandCols,
  className,
  itemClass,
}) => {
  const classNames = cleanClasses(
    `!grid !grid-flow-row grid-cols-${cols} ${
      expandCols ? "md:grid-cols-" + expandCols + "" : ""
    } ${className}`
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
