import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Image from "@/components/atoms/Image";
import loginImage from "@/resources/bild.webp";
import { useEffect, useState } from "react";
import { Flowtext, Subheading } from "@/components/atoms/Text";
import { getRandom } from "@/helpers/imgHelpers";
import { useRouter } from "next/router";
import { register } from "@/helpers/authHelpers";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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


  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async () => {
    if (password !== confirmPassword)
      return setError("Password must be the same in both fields!");
    setError("");
    const response: any = await register({
      registryName: username,
      password,
      email,
    });
    if (response.success) router.push({
      pathname: "/landingpage/login",
      query: { registered: true },
    });
    else setError(response.error);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="basis-3/4">
        <Image src={randomPhoto?.urls.regular}
          alt={""}
          className="h-screen object-cover w-full"
          wrapper="overflow-hidden items-center flex" />
      </div>
      <div className="basis-1/4">
        <div className="m-4 space-y-4">
          <Subheading center wide uppercase>
            Registerpage
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
              type="text"
              label="Email"
              value={email}
              onChange={(val) => setEmail(val)}
            />
            <Input
              type="password"
              bottomText="Must include at least 8 characters"
              label="Password"
              value={password}
              onChange={(val) => setPassword(val)}
            />
            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(val) => setConfirmPassword(val)}
            />
            <Button
              type="submit"
              className="text-white w-full"
            >
              Register
            </Button>
          </form>
          {error && (
            <Flowtext className="text-red-600 !text-base">{error}</Flowtext>
          )}
        </div>
        <Flowtext className="hidden md:inline-block md:absolute bottom-2 right-2 !w-fit text-gray-500 italic !text-sm">Photo by {randomPhoto?.user?.name} on <a target="_blank" href={randomPhoto?.links?.html} className="underline">Unsplash</a></Flowtext>
      </div>
    </div>
  );
}
