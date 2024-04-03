import Container from "@/components/atoms/Container";
import Image from "@/components/atoms/Image";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Post from "@/components/organisms/Post";
import Loading from "@/components/static/Loading";
import { getNextPost } from "@/middleware/middleware";
import { useEffect, useRef, useState } from "react";
import topImage from "@/resources/explorepage_image.jpg";

export default function Home() {
  const [feed, setFeed] = useState<any[]>([]);
  const [feedIterationNr, setFeedIterationNr] = useState<number>(-1);

  const getNext = async () => {
    const { data } = await getNextPost(
      Math.floor(Math.random() * 5),
      feedIterationNr
    );
    if (data) {
      setFeedIterationNr(feedIterationNr + 1);
      setFeed([...feed, data]);
    }
  };
  useEffect(() => {
    if (feedIterationNr < 0) setFeedIterationNr(0);
    getNext();
  }, [feedIterationNr]);

  return (
    <div className="w-full">
      <Container center>
        <div className="md:!hidden !block">
          <Text.Subheading center bold wide uppercase>
            Explore
          </Text.Subheading>
          <Spacing line />
        </div>
        <div className="w-full !hidden md:!block">
          <div className="relative w-full">
            <Image
              src={topImage.src}
              className="w-full"
              wrapper="max-h-60 overflow-hidden items-center flex rounded-lg"
            />
            <div className="!absolute !top-1/2 w-full">
              <Text.Heading bold wide uppercase center>
                - e x p l o r e -
              </Text.Heading>
            </div>
          </div>
          <Text.Flowtext className="!text-xs !text-gray-600/80" italic>
            Photo by{" "}
            <a
              href="https://unsplash.com/@joshuaearle"
              target="_blank"
              className="underline"
            >
              Joshua Earle
            </a>{" "}
            on{" "}
            <a
              href="https://unsplash.com/de/fotos/person-die-tagsuber-in-der-nahe-eines-berges-in-der-nahe-von-wolken-steht-XxVm1FQ12oM"
              target="_blank"
              className="underline"
            >
              Unsplash
            </a>
          </Text.Flowtext>
          <Spacing />
        </div>
        <div>
          {feed[0] ? (
            feed.map((post, idx) => (
              <div className="m-2 p-2 rounded bg-gray-100">
                <Post small data={post} />
              </div>
            ))
          ) : (
            <Loading />
          )}
        </div>
      </Container>
    </div>
  );
}
