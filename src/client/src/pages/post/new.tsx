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
import { DateValueType } from "react-tailwindcss-datepicker";
import { createPost } from "@/helpers/authHelpers";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import DragDropImageUploader from "@/components/atoms/DragDrop";

export default function CreatePost() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState<DateValueType>({
    startDate: "",
    endDate: "",
  });

  const [days, setDays] = useState<TripDay[]>([]);
  const [currentDay, setCurrentDay] = useState<TripDay>();
  const [currentlyEditing, setCurrentlyEditing] = useState<boolean | number>(
    false
  );

  const [dayDialogOpen, setDayDialogOpen] = useState(false);

  const [error, setError] = useState("");

  const handleUpload = async () => {
    const response: any = await createPost({
      title,
      text,
      days: days.map((day) => {
        return { date: day.date.startDate, title: day.title, text: day.text };
      }),
      begin: date?.startDate,
      end: date?.endDate,
    });
    
    if (response?.status === 200) {
      router.push("/post/" + response.data);
    } else {
      console.log(response?.response?.data?.errors?.[0]);
      setError("");
    }
  };

  const handleAddDay = () => {
    setDays([...days, currentDay!]);
    handleDayDialog();
  };

  const handleEditDay = () => {
    const newDays = days;
    newDays[currentlyEditing as number] = currentDay!;
    console.log(newDays);
    setDays(newDays);
    handleDayDialog();
  };

  const handleClearDays = () => {
    setDays([]);
  };

  const handleEditDialog = (day: TripDay, idx: number) => {
    handleDayDialog();
    setCurrentDay(day);
    setCurrentlyEditing(idx);
  };

  const handleDayDialog = () => {
    setDayDialogOpen(!dayDialogOpen);
    setCurrentDay(undefined);
    setCurrentlyEditing(false);
  };

  const updateDay = (props: any) => {
    setCurrentDay({
      guid: "",
      text:
        props?.text || props?.text === "" ? props.text : currentDay?.text || "",
      date:
        props?.date || props?.date === "" ? props.date : currentDay?.date || "",
      title:
        props?.title || props?.title === ""
          ? props.title
          : currentDay?.title || "",
    });
  };

  return (
    <>
      <Dialog open={dayDialogOpen} handler={handleDayDialog}>
        <DialogHeader className="pb-0 flex-col">
          <Subheading center>
            {currentlyEditing !== 0 && !currentlyEditing ? "Add a Day" : `Edit Day ${currentlyEditing as number + 1}`}
          </Subheading>
        </DialogHeader>
        <DialogBody className="pt-0 space-y-2">
          <Flowtext gutter center italic className="!text-base">
            Add a day to your Trip. Days are displayed in a timeline from start
            to end.
          </Flowtext>
          <Flowtext uppercase bold wide className="!text-base !text-slate-800">
            Day{" "}
            {currentlyEditing || currentlyEditing === 0
              ? (currentlyEditing as number) + 1
              : days.length + 1}
            :
          </Flowtext>
          <Input
            label="Title*"
            value={currentDay?.title}
            onChange={(val) => updateDay({ title: val })}
          />
          <Textarea
            label="Text*"
            size="md"
            value={currentDay?.text}
            onChange={(e) => updateDay({ text: e.target.value })}
          />
          <Datepicker
            single
            value={currentDay?.date}
            onChange={(vals) => updateDay({ date: vals })}
          />
          {currentlyEditing !== 0 && !currentlyEditing ? (
            <Button onClick={handleAddDay}>ADD DAY</Button>
          ) : (
            <Button onClick={handleEditDay}>SAVE DAY</Button>
          )}
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
        <Input label="Title*" value={title} onChange={(val) => setTitle(val)} />
        <Textarea
          label="Text*"
          size="md"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Datepicker value={date} onChange={(vals) => setDate(vals)} />
      </Container>
      <Spacing />
      <Container className="space-y-2">
        <Flowtext italic className="!text-sm">
          Optional Fields
        </Flowtext>
        <Container
          sectionMarker
          className="grid md:grid-cols-4 grid-cols-3 gap-2"
        >
          <>
            {days &&
              days.map((day, idx) => (
                <Container
                  onClick={() => {
                    handleEditDialog(day, idx);
                  }}
                  key={idx}
                  className="h-full w-full hover:cursor-pointer p-2 rounded bg-green-300/60 hover:bg-green-300 hover:!text-white transition-all ease-in-out"
                >
                  <Flowtext
                    uppercase
                    center
                    wide
                    className="!text-gray-600/80 !text-base"
                  >
                    click to edit
                  </Flowtext>
                  <Flowtext
                    uppercase
                    center
                    bold
                    wide
                    className="!text-gray-800/80"
                  >
                    day {idx + 1}
                  </Flowtext>
                </Container>
              ))}
          </>
          <Button onClick={handleDayDialog} className="w-full">
            ADD DAY
          </Button>
        </Container>
        {days.length ? (
          <>
            <Flowtext italic className="!text-sm !-mt-1 !text-gray-600/80">
              All changes saved
            </Flowtext>
            <Button onClick={handleClearDays}>CLEAR DAYS</Button>
          </>
        ) : (
          <></>
        )}
        <Spacing />


        <DragDropImageUploader></DragDropImageUploader>

        <Button type="submit" onClick={handleUpload}>
          CREATE POST
        </Button>

        {error ? (
          <Flowtext className="!text-red-500 !text-base">{error}</Flowtext>
        ) : (
          <></>
        )}
      </Container>
    </>
  );
}
