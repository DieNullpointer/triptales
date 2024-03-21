import React from "react";
import defaultPfp from "@/resources/default_profilepic.png";
import { buildBase64Image } from "@/helpers/stringHelpers";
import Image from "./Image";

export interface Props {
  profile?: string;
  size?: "large" | "small";
  className?: string;
}

const Avatar: React.FC<Props> = ({
  profile,
  size = "large",
  className = "",
}) => {
  return (
    <Image
      src={profile ? `https://localhost:7174/${profile}` : defaultPfp.src}
      alt=""
      height={size === "large" ? 110 : 80}
      width={size === "large" ? 110 : 80}
      className={`rounded-full overflow-hidden ${
        size === "large" ? "ring-8" : "ring-4"
      } ring-white`}
      wrapper={className}
    />
  );
};

export default Avatar;
