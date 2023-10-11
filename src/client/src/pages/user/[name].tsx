import Spacing from "@/components/atoms/Spacing";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import { useRouter } from "next/router";

export default function User() {
  const router = useRouter();
  const urlName = router.query.name;

  return (
    <>
    <Spacing />
      <Heading bold center uppercase>
        {urlName}
      </Heading>
      <Flowtext gutter center>
        This is a User. Not approved yet tho
      </Flowtext>
    </>
  );
}
