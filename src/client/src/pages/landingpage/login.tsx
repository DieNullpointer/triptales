import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Image from "@/components/atoms/Image";
import Link from "next/link";
import loginImage from "@/resources/bild.webp"

export default function Login() {
  return (
  <div className="flex justify-center items-center">
    <div className="basis-5/8">
      <Image src={loginImage.src} alt={""} className="w-full h-screen" />
    </div>
    <div className="basis-3/8">
      <div className="m-4 space-y-4">
        <h2 className="text-2xl">Loginpage</h2>
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
        />
        <Input
          type="password"
          bottomText="Must include at least 8 characters"
          label="Password"
        />
      </div>
    </div>
  </div>

  );
}
