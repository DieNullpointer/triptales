import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Image from "@/components/atoms/Image";
import Link from "next/link";
import loginImage from "@/resources/bild.webp"
import router from "next/router";

export default function Login() {
  return (
  <div className="flex justify-center items-center">
    <div className="basis-3/4 ">
      <Image src={loginImage.src} alt={""} className="w-full h-screen" />
    </div>
    <div className="basis-1/4 flex flex-col items-center space-y-3 px-8">
        <Button
          className="text-white w-full"
          onClick={()=>{
            router.push("/landingpage/login")
          }}
        >
          <h1>Login</h1>
        </Button>
        <Button
          className="text-white w-full"
          onClick={()=>{
            router.push("/landingpage/register")
          }}
        >
          <h1>Registrieren</h1>
        </Button>
    </div>
  </div>

  );
}
