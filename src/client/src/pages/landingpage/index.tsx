import Button from "@/components/atoms/Button";
import Image from "@/components/atoms/Image";
import router from "next/router";
import { useEffect, useState } from "react";
import { getRandom } from "@/helpers/imgHelpers";

const [randomPhoto, setRandomPhoto] = useState<any>();

const fetchRandomPhoto = async () => {
  try {
    const photo = await getRandom();
    setRandomPhoto(photo);
  } catch (error: any) {
    console.error("Error fetching random Unsplash photo:", error.message);
  }
};
useEffect(() => {
  fetchRandomPhoto();
}, []);

export default function Login() {
  return (
    <div className="flex justify-center items-center">
      <div className="basis-3/4 ">
        <Image
          src={randomPhoto?.urls.regular}
          alt={""}
          className="h-screen object-cover w-full"
          wrapper="overflow-hidden items-center flex"
        />
      </div>
      <div className="basis-1/4 flex flex-col items-center space-y-3 px-8">
        <Button
          className="text-white w-full"
          onClick={() => {
            router.push("/landingpage/login");
          }}
        >
          <h1>Login</h1>
        </Button>
        <Button
          className="text-white w-full"
          onClick={() => {
            router.push("/landingpage/register");
          }}
        >
          <h1>Registrieren</h1>
        </Button>
      </div>
    </div>
  );
}
