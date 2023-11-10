import Button from "@/components/atoms/Button";
import Link from "next/link";
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
