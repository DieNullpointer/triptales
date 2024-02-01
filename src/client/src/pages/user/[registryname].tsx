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
        <Container className="flex justify-end items-start" sectionMarker>
          {!authorized ? (
            <Button className="flex items-center !p-3" onClick={() => {}}>
              <Flowtext className="!text-sm mr-1">Follow</Flowtext>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
              </svg>
            </Button>
          ) : <></>}
        </Container>
      </Grid>
    </div>
  ) : (
    <Loading />
  );
}
