import { Card } from "@material-tailwind/react";
import React from "react";
import MenuProvider from "./MenuProvider";
import  Grid  from "../atoms/Grid";
import Container from "@/components/atoms/Container";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import Spacing from "@/components/atoms/Spacing";
import Image from "@/components/atoms/Image";
import BigLogo from "@/resources/triptales_homepage_tight_transparent.png";

const Footer: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <Grid cols={1} className="gap-0" even>
        <Container className="flex flex-col py-16" sectionMarker>
          <Flowtext italic bold>
            Contact
          </Flowtext>
          <Spacing space={1.5} />
          <Flowtext className="!text-sm md:!text-base ">
            sei20375@spengergasse.at
          </Flowtext>
          <Flowtext className="!text-sm md:!text-base">
            +43 1 205 108 525
          </Flowtext>
        </Container>
        <Container className="py-8" sectionMarker>
          <Image
            src={BigLogo.src}
            alt="TripTales Logo"
            width={300}
            height={300}
            wrapper="flex justify-center items-center"
          />
        </Container>
        <Container className="flex flex-col py-16 text-right pr-6" sectionMarker>
          <Flowtext italic bold>
            Information
          </Flowtext>
          <Spacing space={1.5} />
          <Flowtext className="!text-sm md:!text-base ">
            Impressum
          </Flowtext>
          <Flowtext className="!text-sm md:!text-base">
            Datenschutz
          </Flowtext>
        </Container>
      </Grid>
  );
};

export default Footer;
