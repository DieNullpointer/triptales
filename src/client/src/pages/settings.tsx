import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { changeUser, getAuthorizedAll } from "@/helpers/authHelpers";
import { useEffect, useState } from "react";
import Loading from "@/components/static/Loading";
import { getSelf } from "@/middleware/middleware";

export default function Settings() {
  const {data, error, isLoading} = getSelf();
  
  const [user, setUser] = useState<any>();
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("");
  const [favDestination, setFavDestination] = useState("");

  useEffect(() => {
    setUsername(data?.username);
    setDescription(data?.description);
    setEmail(data?.email);
    setOrigin(data?.origin);
    setFavDestination(data?.favDestination);
  }, [data]);

  const handleSubmit = async () => {
    // CHANGESUBMIT HERE (sry had to delete)
  };

  return data ? (
    <div className="md:basis-1/4 w-full">
      <div className="m-4 space-y-4">
        <Input
          label="Username"
          value={username}
          onChange={(val) => setUsername(val)}
        />
        <Input
          label="Description"
          value={description}
          onChange={(val) => setDescription(val)}
        />
        <Input label="email" value={email} onChange={(val) => setEmail(val)} />
        <Input
          label="Origin"
          value={origin}
          onChange={(val) => setOrigin(val)}
        />
        <Input
          label="Favorite Destination"
          value={favDestination}
          onChange={(val) => setFavDestination(val)}
        />
        <Button
          type="submit"
          className="text-white w-full"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
