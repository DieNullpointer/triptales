import { Spinner } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import NotFound from "../molecules/NotFound";

const Loading: React.FC<{ timeout?: boolean }> = ({ timeout = false }) => {
  const [timeoutError, setTimeoutError] = useState<boolean>(false);

  useEffect(() => {
    if (timeout)
      setTimeout(() => {
        setTimeoutError(true);
      }, 10000);
  }, [timeout]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      {timeoutError ? (
        <NotFound text="This page took too long to load." />
      ) : (
        <Spinner className="h-14 w-14" color="green" />
      )}
    </div>
  );
};

export default Loading;
