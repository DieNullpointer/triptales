import Image from "@/components/atoms/Image";
import { getUser, getUserByRegistry } from "@/middleware/middleware";
import { useRouter } from "next/router";

import defaultBanner from "@/resources/default_bannerpic.jpg";
import defaultPfp from "@/resources/default_profilepic.png";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import Loading from "@/components/static/Loading";
import Spacing from "@/components/atoms/Spacing";
import Container from "@/components/atoms/Container";
import Grid from "@/components/atoms/Grid";
import { buildBase64Image } from "@/helpers/stringHelpers";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { useEffect, useState } from "react";
import { getAuthorized } from "@/helpers/authHelpers";
import Follow from "@/components/static/Follow";

export default function User() {
  const router = useRouter();
  const registryname: any = router.query?.registryname;
  const [authorized, setAuthorized] = useState(false);
  const { user, profile, banner, error, isLoading } =
    getUserByRegistry(registryname);

  const init = async () => {
    setAuthorized(await getAuthorized() === user?.registryName) 
  };

  useEffect(() => {
    init();
  });

  return user ? (
    <div>
      <div className="relative">
        <Image
          src={banner || defaultBanner.src}
          alt=""
          className="w-full"
          wrapper="max-h-60 overflow-hidden items-center flex rounded-lg"
        />
        <Avatar
          profile={profile}
          size="large"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        />
      </div>
      <div className="mt-16">
        <Subheading bold center className="!tracking-wider">
          {user?.displayName}
        </Subheading>
        <Flowtext className="italic !text-slate-600" center>
          @{user?.registryName}
        </Flowtext>
      </div>
      <Spacing space={4} />
      <Grid cols={1} expandCols={2} className="gap-8" even>
        <Container className="flex flex-col !p-4" sectionMarker>
          <Flowtext italic bold>
            About this User
          </Flowtext>
          <Spacing space={1.5} />
          <Flowtext className="!text-sm md:!text-base">
            {user?.description}
          </Flowtext>
        </Container>
        <Container className="flex justify-start space-y-2 flex-col" sectionMarker>
          {!authorized ? (
            <Follow registryName={user.registryName} />
          ) : <></>}
          <Flowtext center className="!text-sm">Followers: {user?.followerCount}</Flowtext>
          <Flowtext center className="!text-sm">Following: {user?.followingCount}</Flowtext>
        </Container>
      </Grid>
    </div>
  ) : (
    <Loading />
  );
}
