import Button from "@/components/Button";

export default function Home() {
  return (
    <main>
      <h2 className='text-2xl'>HOMEPAGE</h2>
      <p className='leading-8 mb-6'>index.tsx editieren zum Bearbeiten.<br/>Hier die derzeitigen components (tailwind usw. eingebaut):</p>
      <Button color="secondary" onClick={() => console.log('abc')} uppercase className="text-sm">Testbutton</Button>
    </main>
  )
}
