import defaultBanner from "@/resources/default_bannerpic.jpg";
import Image from "../atoms/Image";
import InteractableImage from "../atoms/InteractableImage";

export interface Props {
  images: string[];
  className?: string;
}

const ImageCollection: React.FC<Props> = ({ images, className }) => {
  return (
    <div className="flex flex-row overflow-x-auto scroll-mt-2">
      {images.map((image) => (
        <InteractableImage
          src={"https://localhost:7174/" + image.replace("\\", "/")}
        />
      ))}
    </div>
  );
};

export default ImageCollection;
