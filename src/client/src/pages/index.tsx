import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Home() {
  return (
    <main className="space-y-4">
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
    </main>
  );
}
