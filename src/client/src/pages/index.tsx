import Container from "@/components/atoms/Container";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import { useRef, useState } from "react";

export default function Home() {
    const feedStartTimestamp = useRef<number>(Date.now());
    const [feedIterationNr, setFeedIterationNr] = useState<number>(0);

  return (
    <div className="w-full">
      <Container center>
        <Text.Subheading center bold wide uppercase>Explore</Text.Subheading>
        <Spacing line />
      </Container>
    </div>
  );
}
