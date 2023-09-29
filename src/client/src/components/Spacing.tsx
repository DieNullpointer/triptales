import { useState } from "react";

const Spacing: React.FC<{ spacing: number; line?: boolean }> = ({
  spacing = 6,
  line,
}) => {
  return (
    <div
      className={`h-${spacing + ''} ${line ? "border-t border-black" : ""}`}
    ></div>
  );
};

export default Spacing;
