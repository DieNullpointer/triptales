import defaultBanner from "@/resources/default_bannerpic.jpg";
import Image from "../atoms/Image";
import InteractableImage from "../atoms/InteractableImage";

export interface Props {
  images: [{ image: string }];
  className?: string;
}

const ImageCollection: React.FC<Props> = ({ images, className }) => {
  return (
    <div className="flex flex-row">
      {images.map((image) => (
        <InteractableImage
          src={defaultBanner.src}
        />
      ))}
    </div>
  );
};

export default ImageCollection;
