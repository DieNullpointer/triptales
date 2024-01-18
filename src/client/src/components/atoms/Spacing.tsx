import { useState } from "react";

const Spacing: React.FC<{ space?: number; line?: boolean; className?: string }> = ({
  space = 6,
  line,
  className = ""
}) => {
  return (
    <div
      className={`h-${space + ''} ${line ? "border-t border-black" : ""} ${className}`}
    ></div>
  );
};

export default Spacing;
