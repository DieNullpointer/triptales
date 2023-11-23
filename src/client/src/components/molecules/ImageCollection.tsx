import defaultBanner from "@/resources/default_bannerpic.jpg";
import Image from "../atoms/Image";

export interface Props {
  images: [{ image: string }];
  className?: string;
}

const ImageCollection: React.FC<Props> = ({ images, className }) => {
  return (
    <div className="flex flex-row">
      {images.map((image) => (
        <Image
          src={defaultBanner.src}
          onClick={() => console.log("test")}
          className="h-full hover:opacity-80 hover:cursor-pointer"
          wrapper="h-42 max-w-xs overflow-hidden items-center flex rounded"
        />
      ))}
    </div>
  );
};

export default ImageCollection;
