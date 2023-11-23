import { useState } from "react";
import Image from "./Image";
import { Dialog } from "@material-tailwind/react";

const InteractableImage: React.FC<{ src: string }> = ({ src }) => {
  const [fullSize, setFullSize] = useState<boolean>(false);

  const handler = () => {
    setFullSize(!fullSize);
  };

  return (
    <>
      <Image
        src={src}
        onClick={handler}
        className="h-full hover:opacity-80 hover:cursor-zoom-in"
        wrapper="h-42 max-w-xs overflow-hidden items-center flex rounded"
      />
      <Dialog open={fullSize} size="lg" handler={handler} className="bg-transparent">
        <Image
          src={src}
          onClick={handler}
          className="h-full w-auto"
        />
      </Dialog>
    </>
  );
};

export default InteractableImage;
