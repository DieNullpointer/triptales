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
        className="h-full hover:opacity-80 hover:cursor-zoom-in object-cover"
        wrapper="w-auto overflow-hidden items-center flex rounded object-cover"
      />
      <Dialog open={fullSize} size="lg" handler={handler} className="bg-transparent">
        <Image
          src={src}
          onClick={handler}
          className="h-full w-auto object-cover"
        />
      </Dialog>
    </>
  );
};

export default InteractableImage;
