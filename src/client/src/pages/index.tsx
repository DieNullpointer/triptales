import Button from "@/components/atoms/Button";
import Container from "@/components/atoms/Container";
import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Image from "@/components/atoms/Image";
import Link from "next/link";

import BigLogo from "@/resources/triptales_homepage_tight_transparent.png"

export default function Home() {
  return (
    <div className="w-full">
      <Container center>
        <Image src={BigLogo.src} alt="TripTales Logo" width={300} height={300} wrapper="flex justify-center items-center" />
      <Spacing />
        <Text.Flowtext center gutter>
          Explore the world of travelling with TripTales. Connect with other fellow travellers and explore the world together.<br />
          Share memories, tips, images and routes throughout your journey, helping others to discover that location in the process.
        </Text.Flowtext>
        <Spacing line />
      </Container>
    </div>
  );
}
