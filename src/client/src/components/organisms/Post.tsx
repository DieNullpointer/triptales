import { TripDay, TripPost } from "@/types/types";
import React from "react";
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

export interface Props {
  data: TripPost;
  small?: boolean;
  loading?: boolean;
}

export interface PropsDay {
  data: TripDay;
}

const Day: React.FC<PropsDay> = ({data}) => {
  return <></>
}

const Post: React.FC<Props> = ({ data, small, loading }) => {
  // shadow-lg rounded-[2rem] bg-greenwhite
  
  return !loading ? (
    <Container className="relative h-screen m-12">
      <div className="flex lg:flex-row flex-col lg:items-center items-start lg:justify-between ">
        <div className="place-items-center flex flex-row">
          <Avatar size="small" />
          <div className="p-2 rounded ml-1">
            <Subheading bold className="!text-base md:!text-xl">
              {data.user.displayName}
            </Subheading>
            <Flowtext
              italic
              className="!text-slate-600 !text-sm md:!text-sm -mt-1"
            >
              @{data.user.registryName}
            </Flowtext>
          </div>
        </div>
        <div className="md:m-4 m-2 w-full flex flex-row !text-slate-600 lg:w-auto">
          <CalendarDaysIcon className="h-6 w-6 mr-1" />
          <Flowtext italic className="">
            {formatDateEuropean(data.begin)} <b>-</b>{" "}
            {formatDateEuropean(data.end)}
          </Flowtext>
        </div>
      </div>
      <div className="md:mt-1">
        <Heading className="tracking-tight mb-2">{data.title}</Heading>
        <div className="flex flex-row">
          <Flowtext>{data.text}</Flowtext>
        </div>
      </div>
    </Container>
  ) : (
    <Loading />
  );
};

export default Post;
