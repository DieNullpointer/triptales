import Container from "@/components/atoms/Container";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Post from "@/components/organisms/Post";
import Loading from "@/components/static/Loading";
import { getNextPost } from "@/middleware/middleware";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const feedStartTimestamp = useRef<number>(Date.now());
  const [feed, setFeed] = useState<any[]>([]);
  const [feedIterationNr, setFeedIterationNr] = useState<number>(-1);

  const getNext = async () => {
    const { data } = await getNextPost(Math.floor(Math.random() * 5), feedIterationNr);
    if (data) {
      setFeedIterationNr(feedIterationNr + 1);
      setFeed([...feed, data]);
      console.log(data);
      console.log(feed);
    }
  };
  useEffect(() => {
    if (feedIterationNr < 0) setFeedIterationNr(0);
    getNext();
  }, [feedIterationNr]);

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
