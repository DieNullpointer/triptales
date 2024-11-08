import Container from "@/components/atoms/Container";
import Image from "@/components/atoms/Image";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Post from "@/components/organisms/Post";
import Loading from "@/components/static/Loading";
import topImage from "@/resources/explorepage_image.jpg";
import { getRandomPosts } from "@/middleware/middleware";
import { useEffect, useState } from "react";

export default function Home() {
  const [feed, setFeed] = useState<any[]>([]);

  const getNext = async () => {
    const { data } = await getRandomPosts();
    if (data) {
      setFeed(data);
    }
  };
  useEffect(() => {
    getNext();
  }, []);

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
          {feed ? (
            feed?.map((post, idx) => (
              <div key={idx} className="m-2 p-2 rounded bg-gray-100">
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
