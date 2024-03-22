import Container from "@/components/atoms/Container";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Post from "@/components/organisms/Post";
import Loading from "@/components/static/Loading";
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
        <Text.Subheading center bold wide uppercase>
          Explore
        </Text.Subheading>
        <Spacing line />
        <div>
          {feed[0] ? (
            feed.map((post, idx) => <div className="m-2 p-2 rounded bg-gray-100"><Post small data={post} /></div>)
          ) : (
            <Loading />
          )}
        </div>
      </Container>
    </div>
  );
}
