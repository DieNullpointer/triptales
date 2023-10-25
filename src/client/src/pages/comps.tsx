import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Spacing from "@/components/atoms/Spacing";
import * as Text from "@/components/atoms/Text";
import Link from "next/link";
import useLocalStorage from "uselocalstoragenextjs";

export default function CompsPage() {
  const { setLocalStorage } = useLocalStorage({
    name: "bearerToken",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">HOMEPAGE</h2>
      <p className="leading-8 mb-6">
        index.tsx editieren zum Bearbeiten.
        <br />
        Hier die derzeitigen components (tailwind usw. eingebaut):
      </p>
      <Button>Button</Button>
      <Input
        label="Username"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
      <Input label="Email Adresse" width="20rem" />
      <Input
        type="password"
        bottomText="Must include at least 8 characters"
        label="Password"
      />
      <Link href="/user/1">Test Link</Link>
      <div id="headingshowcase" className="space-y-0">
        <Spacing space={10} line />
        <Text.Heading wide uppercase>
          Testheading
        </Text.Heading>
        <Text.Subheading gutter underline>
          Subheading
        </Text.Subheading>
        <Text.Flowtext>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet.
        </Text.Flowtext>
      </div>
      <div className="flex flex-row justify-around">
        <Button onClick={() => setLocalStorage("xyz123")}>Log In</Button>
        <Button onClick={() => setLocalStorage("")}>Log Out</Button>
      </div>
    </div>
  );
}
