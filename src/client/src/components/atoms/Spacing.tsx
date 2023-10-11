import { useState } from "react";

const Spacing: React.FC<{ space?: number; line?: boolean }> = ({
  space = 6,
  line,
}) => {
  return (
    <div
      className={`h-${space + ''} ${line ? "border-t border-black" : ""}`}
    ></div>
  );
};

export default Spacing;
