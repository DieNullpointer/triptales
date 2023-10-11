import Container from "@/components/atoms/Container";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Image from "@/components/atoms/Image";
//import useSWR from "swr";

import BigLogo from "@/resources/triptales_homepage_tight_transparent.png";

export default function Home() {
  /* const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    "https://localhost:7174/api/User",
    fetcher
  );
  console.log(data); */

  return (
    <div className="w-full">
      <Container center>
        <Image
          src={BigLogo.src}
          alt="TripTales Logo"
          width={300}
          height={300}
          wrapper="flex justify-center items-center"
        />
        <Spacing />
        <Text.Flowtext center gutter>
          Explore the world of travelling with TripTales. Connect with other
          fellow travellers and explore the world together.
          <br />
          Share memories, tips, images and routes throughout your journey,
          helping others to discover that location in the process.
        </Text.Flowtext>
        <Spacing line />
      </Container>
    </div>
  );
}
