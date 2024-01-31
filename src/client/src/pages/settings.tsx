import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { getUser, getUserByRegistry} from "@/middleware/middleware";
import {getAuthorizedAll} from "@/helpers/authHelpers"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/static/Loading";
import Avatar from "@/components/atoms/Avatar";

import Image from "@/components/atoms/Image";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import Spacing from "@/components/atoms/Spacing";
import Container from "@/components/atoms/Container";
import Grid from "@/components/atoms/Grid";

export default function Settings() {
  const [user, setUser] = useState<any>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const initialise = async () => {
    try {
      const authorized = await getAuthorizedAll();
      console.log(getUserByRegistry(authorized))
      /** 
      const a = getUserByRegistry(authorized)
      console.log(a);
      setUser(a)
      **/
    } catch (error: any) {
      console.error("Error fetching random Unsplash photo:", error.message);
    }
  };
  useEffect(() => {
    initialise();
  }, []);


  
const handleSubmit = async () => {
  }; 

   

    

    return user ? (
        <div>
          
        <Grid cols={3} expandCols={2} className="" even>
        <Container className="flex flex-col !p-4" sectionMarker>
          <Flowtext italic bold>
            About this User
          </Flowtext>
          <Spacing space={1.5} />
          <Flowtext className="!text-sm md:!text-base">
            {user?.description}
          </Flowtext>
        </Container>

        <Container className="flex flex-col !p-4" sectionMarker>
        <Flowtext italic bold>
            Change 
          </Flowtext>
        </Container>
      </Grid>




      <div className="md:basis-1/4 w-full">
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
        </div>
      </div>
        </div>




        

    ) : (
        <Loading />
    );
}