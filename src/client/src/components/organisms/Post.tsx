import { TripDay, TripPost } from "@/types/types";
import React, { useEffect, useState } from "react";
import Container from "../atoms/Container";
import Image from "../atoms/Image";
import defaultPfp from "@/resources/default_profilepic.png";
import { Flowtext, Heading, Subheading } from "../atoms/Text";
import Loading from "../static/Loading";
import { formatDateEuropean } from "@/helpers/stringHelpers";
import {
  CalendarDaysIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Avatar from "../atoms/Avatar";
import {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
} from "@material-tailwind/react";
import Spacing from "../atoms/Spacing";
import ImageCollection from "../molecules/ImageCollection";

import TestImage from "@/resources/DevImages/Antelope Canyon.jpg";
import Button from "../atoms/Button";
import { useRouter } from "next/router";
import IconButton from "../molecules/IconButton";
import { likePost } from "@/middleware/middleware";
import { getAuthorized } from "@/helpers/authHelpers";
import Link from "next/link";

export interface Props {
  data: TripPost;
  small?: boolean;
  loading?: boolean;
}

const Day: React.FC<{ day: TripDay }> = ({ day }) => {
  return <Flowtext className="!text-sm !text-slate-600">{day.text}</Flowtext>;
};

const Days: React.FC<{ days: TripDay[]; className?: string }> = ({
  days,
  className,
}) => {
  return (
    <div className={className}>
      <Timeline>
        {days.map((day, idx) => (
          <TimelineItem className="pb-6 h-full">
            <TimelineConnector className="!h-full" />
            <TimelineHeader className="h-auto items-center">
              {idx >= days.length ? <></> : <TimelineIcon />}
              <Flowtext bold tightHeight className="tracking-tight !h-min">
                Day {idx + 1}: {day.title}
              </Flowtext>
            </TimelineHeader>
            <TimelineBody>
              <Day day={day} />
            </TimelineBody>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

const Post: React.FC<Props> = ({ data, small, loading }) => {
  const router = useRouter();
  const [likes, setLikes] = useState<number>(data?.likes || 0);
  const [authorized, setAuthorized] = useState(false);

  const init = async () => {
    setAuthorized(await getAuthorized());
  };

  const handleLikes = async () => {
    const newLikes = await likePost(data.guid);
    setLikes(newLikes!);
  };

  useEffect(() => {
    init();
  });

  return !loading ? (
    <Container className={`relative m-12 ${small ? "h-fit" : "min-h-screen"}`}>
      <div className="flex lg:flex-row flex-col lg:items-center items-start lg:justify-between">
        <div className="place-items-center flex flex-row">
          <Avatar size="small" />
          <div className="p-2 rounded ml-1">
            <Subheading bold className="!text-base md:!text-xl">
              {data.user.displayName}
            </Subheading>
            <Link href={`/user/${data.user.registryName}`}><Flowtext
              italic
              className="!text-slate-600 !text-sm md:!text-sm -mt-1"
            >
              @{data.user.registryName}
            </Flowtext></Link>
          </div>
        </div>
        <div className="md:m-4 m-2 w-full flex flex-col !text-slate-600 lg:w-auto">
          <div className="flex flex-row justify-center">
            <CalendarDaysIcon className="h-6 w-6 mr-1" />
            <Flowtext italic className="">
              {formatDateEuropean(data.begin)} <b>-</b>{" "}
              {formatDateEuropean(data.end)}
            </Flowtext>
          </div>
          {
            <div className="flex flex-row -ml-2 items-center">
              <IconButton
                preset="like"
                disabled={!authorized}
                onClick={handleLikes}
              />
              <Flowtext className="w-fit ml-1">{likes}</Flowtext>
            </div>
          }
        </div>
      </div>
      <div className="md:mt-1">
        <Heading className="tracking-tight mb-2">{data.title}</Heading>
        <div className="flex flex-row">
          <Flowtext>{data.text}</Flowtext>
        </div>
        {!small && (
          <>
            <Days days={data.days} className="mx-2 mt-6" />
            {data.images && (
              <>
                <Spacing />
                <Flowtext bold>Images</Flowtext>
                <ImageCollection images={data.images} />
              </>
            )}
          </>
        )}
      </div>
      <>
        {small && (
          <div className="w-full flex items-center justify-center pt-4">
            <Button
              transparent
              onClick={() => router.push("/post/" + data.guid)}
            >
              <Flowtext uppercase className="!text-sm" bold>
                View full Post
              </Flowtext>
            </Button>
          </div>
        )}
      </>
    </Container>
  ) : (
    <Loading />
  );
};

export default Post;
