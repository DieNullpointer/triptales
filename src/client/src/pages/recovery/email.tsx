import Button from "@/components/atoms/Button";
import CustomInput from "@/components/atoms/Input";
import { Flowtext, Subheading } from "@/components/atoms/Text";
import { logout } from "@/helpers/authHelpers";
import { changeEmail } from "@/middleware/middleware";
import { useRouter } from "next/router";
import React, { useState } from "react";

const Email: React.FC = () => {
  const router = useRouter();
  const { token } = router.query;

  const [email, setEmail] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = async () => {
    setError("");
    if (email !== cEmail) return setError("Email do not match");
    const response: any = await changeEmail(token!, email);
    console.log(response);

    if (response?.status === 200) {
    } else setError("An unknown error occured");
  };

  return (
    <div>
      <Subheading uppercase wide bold>
        Account recovery
      </Subheading>
      <Flowtext gutter>
        Please enter and confirm a new email for your account.
      </Flowtext>
      <div className="space-y-2">
        <CustomInput
          label="New email"
          onChange={(val) => setEmail(val)}
          value={email}
        ></CustomInput>
        <CustomInput
          label="Confirm new email"
          value={cEmail}
          onChange={(val) => setCEmail(val)}
          bottomText={error}
        ></CustomInput>
        <Button onClick={handleChange}>Reset and Confirm</Button>
      </div>
    </div>
  );
};

export default Email;
