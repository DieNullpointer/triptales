import { TripPost } from "@/types/types";
import React from "react";
import Container from "../atoms/Container";
import Image from "../atoms/Image";
import defaultPfp from "@/resources/default_profilepic.png";
import { Flowtext, Heading, Subheading } from "../atoms/Text";
import Loading from "../static/Loading";

export interface Props {
  data: TripPost;
  small?: boolean;
  loading?: boolean;
}

const Post: React.FC<Props> = ({ data, small, loading }) => {
  const format = (date: Date) => {
    var d = new Date(date);
    return d.getDay() + "." + d.getMonth() + "." + d.getFullYear();
  };

  return !loading ? (
    <Container className="relative h-screen m-12" sectionMarker>
      <div className="flex lg:flex-row flex-col bg-white rounded lg:items-center items-start lg:justify-between ">
        <div className="place-items-center flex flex-row">
          <Image
            src={defaultPfp.src}
            alt=""
            height={80}
            width={80}
            className="rounded-full ring-4 ring-white"
          />
          <div className="bg-white p-2 rounded ml-1">
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
        <div className="m-4 w-full lg:w-auto">
          <Flowtext italic center className="!text-slate-600 w-full lg:w-auto">
            {format(data.begin)} <b>-</b> {format(data.end)}
          </Flowtext>
        </div>
      </div>
    </Container>
  ) : (
    <Loading />
  );
};

export default Post;
