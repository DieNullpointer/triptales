import { Spinner } from "@material-tailwind/react";
import React from "react";

const Loading: React.FC<{}> = () => {
    return <div className="w-full min-h-screen flex items-center justify-center">
        <Spinner className="h-14 w-14" color="green" />
    </div>
}

export default Loading;