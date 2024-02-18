import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import Container from "@/components/atoms/Container";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import Datepicker from "@/components/molecules/Datepicker";
import { Textarea } from "@material-tailwind/react";
import Button from "@/components/atoms/Button";


export default function () {
  return (<>
    <Container>
      <Heading center>CREATE A NEW POST</Heading>
      <Spacing space={10} line />
      <Flowtext>Required Fields</Flowtext>
      <Input
        label="Title"
      />
      <Spacing space={4} />
      <Textarea
        label="Text"
        size="md"
      />
      <Spacing space={4} />
      <Datepicker />
      <Spacing space={4} />
      <Datepicker />
      <Spacing space={4} />
    </Container>

    <Container>
      <Flowtext>Optional Fields</Flowtext>
      <Button className="">+ Add Days</Button>
      <Flowtext>(Note: Add Day via Dialoge)</Flowtext>
    </Container></>
  );
}