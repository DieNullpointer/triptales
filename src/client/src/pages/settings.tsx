
import { getUser, getUserByRegistry, getUserMe } from "@/middleware/middleware";
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
    const router = useRouter();
    const username = getUserMe();
    console.log(username)
    const { user, profile, banner, error, isLoading } = getUserByRegistry(username.String);
    
    

    const handleSubmit = async () => {
      const response: any = await `https://localhost:7174/api/User/change`;
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
        </div>
        

    ) : (
        <Loading />
    );
}