import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Home() {
  return (
    <main className="space-y-4">
      <h2 className='text-2xl'>HOMEPAGE</h2>
      <p className='leading-8 mb-6'>index.tsx editieren zum Bearbeiten.<br/>Hier die derzeitigen components (tailwind usw. eingebaut):</p>
      <Button>Button</Button>
      <Input label="Username" width="15rem" />
      <Input type="password" bottomText="Must include at least 8 characters" label="Password" />
    </main>
  )
}
