import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import Container from "@/components/atoms/Container";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import Datepicker from "@/components/molecules/Datepicker";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Textarea,
} from "@material-tailwind/react";
import Button from "@/components/atoms/Button";
import { TripDay } from "@/types/types";
import { useState } from "react";

export default function CreatePost() {
  const [days, setDays] = useState<TripDay[]>([]);
  const [currentDay, setCurrentDay] = useState<TripDay>();

  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  const handleAddDay = () => {};

  const handleDayDialog = () => {
    setDayDialogOpen(!dayDialogOpen);
  };

  const updateDay = (props: any) => {
    setCurrentDay({
      guid: "",
      text: props?.text || currentDay?.text || "",
      date: props?.date || currentDay?.date || "",
      images: props?.images || currentDay?.images,
      title: props?.title || currentDay?.title ||"",
    })
  }

  return (
    <>
      <Dialog open={dayDialogOpen} handler={handleDayDialog}>
        <DialogHeader className="pb-0 flex-col">
          <Subheading center>Add a Day</Subheading>
        </DialogHeader>
        <DialogBody className="pt-0 space-y-2">
          <Flowtext gutter center italic className="!text-base">
            Add a day to your Trip. Days are displayed in a timeline from start
            to end.
          </Flowtext>
          <Input
            label="Title"
            value={currentDay?.title}
            onChange={(val) =>
              updateDay({ title: val})
            }
          />
          <Textarea label="Text" size="md" />
          <Datepicker single />
          <Button onClick={handleAddDay}>Add Day</Button>
        </DialogBody>
      </Dialog>
      <Container className="space-y-2">
        <Subheading center uppercase>
          CREATE A NEW POST
        </Subheading>
        <Spacing space={10} line />
        <Flowtext italic className="!text-sm">
          Required Fields
        </Flowtext>
        <Input label="Title" />
        <Textarea label="Text" size="md" />
        <Datepicker />
      </Container>
      <Spacing />
      <Container className="space-y-2">
        <Flowtext italic className="!text-sm">
          Optional Fields
        </Flowtext>
        <Container sectionMarker>
          <>
            {days &&
              days.map((day, idx) => (
                <Container onClick={() => {}} key={idx}>
                  <>{day.title}</>
                </Container>
              ))}
          </>
          <Button onClick={handleDayDialog}>Add Day</Button>
        </Container>
      </Container>
    </>
  );
}
