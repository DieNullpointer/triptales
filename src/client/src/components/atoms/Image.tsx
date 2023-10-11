import TImage from "next/image";
import React from "react";

export interface Props {
  wrapper?: string;
  width: number;
  height: number;
  src: string;
  alt: string;
}

const Image: React.FC<Props> = ({ width, height, wrapper, src, alt }) => {
  const img = <TImage width={width} height={height} src={src} alt={alt} />;
  return wrapper ? <div className={wrapper}>{img}</div> : img;
};

export default Image;