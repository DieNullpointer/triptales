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
  loading?: boolean
}

const Post: React.FC<Props> = ({ data, small, loading }) => {
  return (
    !loading ? <Container className="relative h-screen m-12" sectionMarker>
    <div className="flex flex-row bg-white rounded items-center justify-between">
      <div className="place-items-center flex flex-row">
      <Image
        src={defaultPfp.src}
        alt=""
        height={80}
        width={80}
        className="rounded-full ring-4 ring-white"
      />
      <div className="bg-white p-2 rounded ml-1">
          <Subheading bold className="!text-base md:!text-xl">{data.user.displayName}</Subheading>
          <Flowtext italic className="!text-slate-600 !text-sm md:!text-sm -mt-1">@{data.user.registryName}</Flowtext>
      </div>
      </div>
      <div className=""><Flowtext italic className="!text-slate-600">from: {data.begin.toString()} to: {data.end.toString()}</Flowtext></div>
    </div>
  </Container> : <Loading />
  );
};

export default Post;
