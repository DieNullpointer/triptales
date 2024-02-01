import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import {changeUser, getAuthorizedAll} from "@/helpers/authHelpers"
import { useEffect, useState } from "react";
import Loading from "@/components/static/Loading";

import Image from "@/components/atoms/Image";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import Spacing from "@/components/atoms/Spacing";
import Container from "@/components/atoms/Container";
import Grid from "@/components/atoms/Grid";

export default function Settings() {
  const [user, setUser] = useState<any>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("");
  const [favDestination, setFavDestination] = useState("");

  const init = async () => {
    try {
      const authorized = await getAuthorizedAll();
      setUser(authorized)
      setPassword(user.password);
      setUsername(user.displayName);
      setDescription(user.description);
      setEmail(user.email);
      setOrigin(user.origin);
      setFavDestination(user.favDestination);
    } catch (error: any) {
      console.error(error.message);
    }
  };
 
  init();


  
const handleSubmit = async () => {
  const response: any = await changeUser({ 
    registryName: user.username,
    displayName: username,
    password: password,
    email: email,
    description: description,
    origin: origin,
    favDestination: favDestination
});
  }; 

   

return user ? (
  <div className="md:basis-1/4 w-full">
      <div className="m-4 space-y-4">
            <Input
              label="Username"             
              value={username}
              onChange={(val) => setUsername(val)}
            />
            <Input
              type="password"
              label="Password"
              value={password}              
              onChange={(val) => setPassword(val)}
            />
            <Input
              label="Description"             
              value={description}
              onChange={(val) => setDescription(val)}
            />
            <Input
              label="email"             
              value={email}
              onChange={(val) => setEmail(val)}
            />
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