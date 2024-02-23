import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import Container from "@/components/atoms/Container";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import Datepicker from "@/components/molecules/Datepicker";
import { Textarea } from "@material-tailwind/react";
import Button from "@/components/atoms/Button";


export default function () {
  return (<>
    <Container className="space-y-2">
      <Subheading center uppercase>CREATE A NEW POST</Subheading>
      <Spacing space={10} line />
      <Flowtext italic className="!text-sm">Required Fields</Flowtext>
      <Input
        label="Title"
      />
      <Textarea
        label="Text"
        size="md"
      />
      <Datepicker />
    </Container>
    <Spacing />
    <Container className="space-y-2">
      <Flowtext italic className="!text-sm">Optional Fields</Flowtext>
      <Button className="">+ Add Days</Button>
    </Container></>
  );
}