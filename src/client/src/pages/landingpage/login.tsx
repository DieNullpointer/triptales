import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Image from "@/components/atoms/Image";
import { useEffect, useState } from "react";
import { Flowtext, Subheading } from "@/components/atoms/Text";
import { login } from "@/helpers/authHelpers";
import { useRouter } from "next/router";

import { getRandom } from "@/helpers/imgHelpers";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [randomPhoto, setRandomPhoto] = useState<any>();
  const [error, setError] = useState("");

  const router = useRouter();

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

  const handleSubmit = async () => {
    setError("");
    const response: any = await login({ registryName: username, password });
    if (response.success) router.push("/");
    else setError(response.error);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="hidden md:block md:basis-3/4">
        <Image
          src={randomPhoto?.urls.regular}
          alt={""}
          className="h-screen object-cover w-full"
          wrapper="overflow-hidden items-center flex"
        />
      </div>
      <div className="md:basis-1/4">
        <div className="m-4 space-y-4">
          <Subheading center uppercase wide>
            Loginpage
          </Subheading>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Input
              label="Username"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              value={username}
              onChange={(val) => setUsername(val)}
            />
            <Input
              type="password"
              label="Password"
              value={password}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              onChange={(val) => setPassword(val)}
            />
            <Button
              type="submit"
              className="text-white w-full"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </form>
          {error && (
            <Flowtext className="text-red-600 !text-base">{error}</Flowtext>
          )}        
        </div>
        <Flowtext className="hidden md:inline-block md:absolute bottom-2 right-2 w-fit text-gray-500 italic !text-sm">Photo by {randomPhoto?.user?.name} on <a target="_blank" href={randomPhoto?.links?.html} className="underline">Unsplash</a></Flowtext>
      </div>
    </div>
  );
}

export default Login;
