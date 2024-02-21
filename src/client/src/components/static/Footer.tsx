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
    <div className="grid md:grid-cols-3 grid-cols-1">
        <Container className="flex flex-col py-16 pl-16" sectionMarker>
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
        <Container className="py-16" sectionMarker>
          <Image
            src={BigLogo.src}
            alt="TripTales Logo"
            width={200}
            height={200}
            wrapper="flex justify-center items-center"
          />
          <Flowtext center className="!text-sm md:!text-base  pt-8">
            &copy; Triptales, 2023
          </Flowtext>
        </Container>
        <Container className="flex flex-col py-16 md:text-right md:pr-16 pl-16 md:pl-0 " sectionMarker>
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
        
      </div>
  );
};

export default Footer;
