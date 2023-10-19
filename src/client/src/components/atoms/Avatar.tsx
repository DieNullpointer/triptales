import { Image as ImageT } from "@/types/types";
import React from "react";
import defaultPfp from "@/resources/default_profilepic.png";
import { buildBase64Image } from "@/helpers/stringHelpers";
import Image from "./Image";

export interface Props {
  profile?: ImageT;
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
      src={profile ? buildBase64Image(profile) : defaultPfp.src}
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
