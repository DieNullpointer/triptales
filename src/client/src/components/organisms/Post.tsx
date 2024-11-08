import { TripDay, TripPost, Comment as CommentType, User } from "@/types/types";
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
import Input from "@/components/atoms/Input";
import { useRouter } from "next/router";
import IconButton from "../molecules/IconButton";
import { likePost } from "@/middleware/middleware";
import {
  deletePost,
  getAuthorized,
  getAuthorizedAll,
} from "@/helpers/authHelpers";
import Link from "next/link";
import SmallProfile from "../molecules/SmallProfile";
import { createComment } from "@/helpers/authHelpers";

export interface Props {
  data: TripPost;
  small?: boolean;
  loading?: boolean;
  userGiven?: any;
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
        {days?.map((day, idx) => (
          <TimelineItem className="pb-6 h-full">
            <TimelineConnector className="!h-full" />
            <TimelineHeader className="h-auto items-center">
              {idx >= days.length ? <></> : <TimelineIcon />}
              <div className="flex flex-row space-x-7 items-center">
                <Flowtext bold tightHeight className="tracking-tight !h-min">
                  Day {idx + 1}: {day.title}
                </Flowtext>
                <div className="h-min w-min flex flex-row items-center">
                <CalendarDaysIcon className="h-6 w-6 mr-1" />
                <Flowtext italic className="">
                  {formatDateEuropean(day.date)}
                </Flowtext>
                </div>
              </div>
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

const Comment: React.FC<{ comment: CommentType; className?: string }> = ({
  comment,
}) => {
  return (
    <div className="my-4">
      <SmallProfile
        inline
        user={{
          displayName: comment.displayName,
          registryName: comment.registryName,
          profilePicture: comment.profilePicture,
        }}
      />
      <Flowtext tightHeight className="!text-sm ml-16 md:pr-16">
        {comment.text}
      </Flowtext>
    </div>
  );
};

const Comments: React.FC<{ comments: CommentType[]; postGuid: string }> = ({
  comments,
  postGuid,
}) => {
  const [comment, setComment] = useState("");
  const [commentsArray, setComments] = useState<CommentType[]>(comments);
  const [error, setError] = useState("");

  const handleComment = async () => {
    const response: any = await createComment({
      text: comment,
      postGuid: postGuid,
    });
    if (response.success) {
      setComment("");
      const user = await getAuthorizedAll();
      setComments([
        {
          displayName: user.displayName,
          registryName: user.username,
          created: Date.now(),
          text: comment,
          profilePicture: user.profilePicture,
        },
        ...commentsArray!,
      ]);
    } else {
      setError("An error occured. Please try again.");
    }
  };

  return (
    <div className="space-y-2">
      <Flowtext center bold wide uppercase>
        Comments
      </Flowtext>
      <div className="flex flex-row items-center">
        <Input
          label="New Comment"
          value={comment}
          onChange={(val) => setComment(val)}
          onEnterPress={handleComment}
          bottomText={error}
        />
        <IconButton
          onClick={handleComment}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-gray-800 rounded-full m-2 hover:fill-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          }
        />
      </div>
      <div>
        {commentsArray?.map((comment, idx) => (
          <Comment comment={comment!} key={idx} className="mx-2 mt-6" />
        ))}
      </div>
    </div>
  );
};

const Post: React.FC<Props> = ({ data, small, loading, userGiven }) => {
  const router = useRouter();
  const [likes, setLikes] = useState<number>(0);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState<any>();

  const init = async () => {
    setAuthorized(await getAuthorized());
    setLikes(data.likes);
    if (!userGiven) setUser(data.user);
    else setUser(userGiven);
  };

  const handleLikes = async () => {
    const newLikes = await likePost(data.guid);
    setLikes(newLikes!);
  };

  const handleDelete = async () => {
    deletePost(data.guid);
    router.replace("/user/" + user?.registryName);
  };

  useEffect(() => {
    init();
  }, [data]);

  return !loading ? (
    <Container className={`relative m-12 ${small ? "h-fit" : "min-h-screen"}`}>
      <div className="flex lg:flex-row flex-col lg:items-center items-start lg:justify-between">
        <SmallProfile user={user} />
        <div className="md:m-4 m-2 w-full flex flex-col !text-slate-600 lg:w-auto">
          <div className="flex flex-row justify-center">
            <CalendarDaysIcon className="h-6 w-6 mr-1" />
            <Flowtext italic className="">
              {formatDateEuropean(data.begin)} <b>-</b>{" "}
              {formatDateEuropean(data.end)}
            </Flowtext>
          </div>
          <div className="flex flex-row space-x-5">
            <div className="flex flex-row -ml-2 items-center">
              <IconButton
                preset="like"
                disabled={!authorized}
                enabled={data.liking}
                onClick={handleLikes}
              />
              <Flowtext className="w-fit ml-1">{likes}</Flowtext>
            </div>
            {!small && authorized === user?.registryName ? (
              <IconButton
                icon={
                  <svg
                    className="w-6 h-6 !text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                }
                onClick={handleDelete}
              />
            ) : (
              <></>
            )}
          </div>
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
                <ImageCollection
                  images={data.images.map((img) =>
                    process.env.NODE_ENV == "production"
                      ? "/" + img.path
                      : "https://localhost:7174/" + img.path
                  )}
                />
              </>
            )}
          </>
        )}
      </div>
      <>
        {small ? (
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
        ) : (
          <Comments postGuid={data.guid} comments={data.comments} />
        )}
      </>
    </Container>
  ) : (
    <Loading />
  );
};

export default Post;
