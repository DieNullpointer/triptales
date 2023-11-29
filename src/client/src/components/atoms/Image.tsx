import TImage from "next/image";
import React from "react";

export interface Props {
  wrapper?: string;
  width?: number | string;
  height?: number | string;
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

const Image: React.FC<Props> = ({ width, height, wrapper, src, alt = " ", onClick, className }) => {
  const img = <img width={width} height={height} src={src} alt={alt} className={className} onClick={onClick} />;
  return wrapper ? <div className={wrapper}>{img}</div> : img;
};

export default Image;