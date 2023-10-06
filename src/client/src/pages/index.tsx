import Button from "@/components/atoms/Button";
import Container from "@/components/atoms/Container";
import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <Container center>
        <Text.Heading center wide bold uppercase>
          homepage
        </Text.Heading>
        <Text.Flowtext center gutter underline>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l
        </Text.Flowtext>
      </Container>
    </div>
  );
}
