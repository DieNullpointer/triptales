import defaultBanner from "@/resources/default_bannerpic.jpg";
import Image from "../atoms/Image";
import InteractableImage from "../atoms/InteractableImage";
import { Button } from "@material-tailwind/react";

export interface Props {
  images: string[];
  className?: string;
  onRemoved?: (url: string) => void;
}

const ImageCollection: React.FC<Props> = ({ images, onRemoved }) => {
  return (
    <div className="flex flex-row overflow-x-auto scroll-mt-2 space-x-4">
      {images.map((image) => (
          <InteractableImage removeable onRemove={(url) => {
            console.log("bottom test");
            onRemoved?.(url)
          }}
          src={image}
        />
      ))}
    </div>
  );
};

export default ImageCollection;
