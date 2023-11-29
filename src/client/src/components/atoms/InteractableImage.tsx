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
        className="h-40 w-auto inline-block hover:opacity-80 hover:cursor-zoom-in object-cover"
      />
      <Dialog open={fullSize} size="lg" handler={handler} className="bg-transparent flex justify-center max-h-screen">
        <Image
          src={src}
          onClick={handler}
          className="max-h-[90vh]"
        />
      </Dialog>
    </>
  );
};

export default InteractableImage;
