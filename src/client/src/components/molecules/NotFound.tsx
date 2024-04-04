import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Flowtext, Heading, Subheading } from "../atoms/Text";

const NotFound: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <XMarkIcon height={50} width={50} />
      <Heading bold uppercase wide className="!w-fit">
        404 &ndash; This is an error
      </Heading>
      <Flowtext center italic light>
        {text && (
          <>
            <span className="!text-red-500">{text}</span>
            <br />
            <br />
          </>
        )}
        Seems like the link you were trying to follow is invalid
        <br />
        or a connection to our servers could not be built.
        <br />
        Try reloading this page if you feel like this is a mistake.
      </Flowtext>
    </div>
  );
};

export default NotFound;
