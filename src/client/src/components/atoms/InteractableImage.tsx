import { useState } from "react";
import Image from "./Image";
import { Dialog } from "@material-tailwind/react";
import IconButton from "../molecules/IconButton";

const InteractableImage: React.FC<{ src: string; onRemove?: (url: string) => void; removeable?: boolean }> = ({
  src,
  onRemove = () => {},
  removeable,
}) => {
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
      <Dialog
        open={fullSize}
        size="lg"
        handler={handler}
        className="bg-transparent flex justify-center max-h-screen relative"
      >
        <Image src={src} onClick={handler} className="max-h-[90vh]" />
        {removeable && (
          <IconButton
            onClick={() => onRemove?.(src)}
            className="!absolute top-2 right-2 bg-opacity-50 rounded-full"
            preset="none"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 stroke-white/60 text-red-600 hover:h-12 hover:w-12 transition-all duration-150 ease-in-out hover:text-gray-800"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        )}
      </Dialog>
    </>
  );
};

export default InteractableImage;
