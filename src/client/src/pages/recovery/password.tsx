import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/Input";
import { Flowtext, Subheading } from "@/components/atoms/Text";
import { logout } from "@/helpers/authHelpers";
import { resetPassword } from "@/middleware/middleware";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Password: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [error, setError] = useState("");

  const handleRecovery = async () => {
    setError("");
    if (password !== cPassword) return setError("Passwords do not match");
    const response: any = await resetPassword(token!, password);
    console.log(response);

    if (response?.status === 200) {
      logout();
      router.push("/landingpage/login?pwchange=true");
    } else setError("An unknown error occured");
  };

  return (
    <div>
      <Subheading uppercase wide bold>
        Account recovery
      </Subheading>
      <Flowtext gutter>
        Please enter and confirm a new password for your account.
      </Flowtext>
      <div className="space-y-2">
        <CustomInput
          label="New password"
          onChange={(val) => setPassword(val)}
          value={password}
          type="password"
        ></CustomInput>
        <CustomInput
          type="password"
          label="Confirm new password"
          value={cPassword}
          onChange={(val) => setCPassword(val)}
          bottomText={error}
        ></CustomInput>
        <Button onClick={handleRecovery}>Reset and Confirm</Button>
      </div>
    </div>
  );
};

export default Password;
