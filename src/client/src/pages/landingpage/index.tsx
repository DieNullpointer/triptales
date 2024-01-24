import Button from "@/components/atoms/Button";
import Image from "@/components/atoms/Image";
import router from "next/router";
import { useEffect, useState } from "react";
import { getRandom } from "@/helpers/imgHelpers";
import Spacing from "@/components/atoms/Spacing";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";

export default function Login() {
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

  return (
    <div className="flex justify-center items-center h-full">
      <div className="hidden md:block md:basis-3/4 ">
        <Image
          src={randomPhoto?.urls.regular}
          alt={""}
          className="h-screen object-cover w-full"
          wrapper="overflow-hidden items-center flex"
        />
      </div>
      <Spacing space={52} className="md:hidden" />
      <div className="md:basis-1/4 flex flex-col items-center space-y-3 px-8 justify-center">
        <Subheading center wide uppercase>
          Welcome
        </Subheading>
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
      <Flowtext className="hidden md:inline-block md:absolute bottom-2 right-2 !w-fit text-gray-500 italic !text-sm">Photo by {randomPhoto?.user?.name} on <a target="_blank" href={randomPhoto?.links?.html} className="underline">Unsplash</a></Flowtext>

    </div>
  );
}
