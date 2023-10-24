import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Image from "@/components/atoms/Image";
import Link from "next/link";
import loginImage from "@/resources/bild.webp"
import Router from "next/router";

export default function Login() {
  function setModalOpen(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (

    <div className="flex justify-center items-center mt-10">
      <h2 className="text-2xl">Loginpage</h2>
      <Button
        className=""
      >
        <h2 className="text-2xl">Login</h2>
      </Button>
      <Button
        className=""
      >
        <h2 className="text-2xl">Register</h2>
      </Button>
    </div>
  );
}
