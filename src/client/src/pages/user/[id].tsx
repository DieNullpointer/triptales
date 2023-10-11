import { getUser } from "@/middleware/middleware";
import { useRouter } from "next/router";

export default function User() {
    const router = useRouter();
    const guid:any = router.query?.id;
  const { user, error, isLoading } = getUser(guid);
  
  return (
    <>
      <h1>USER: {user?.displayName}</h1>
      <h1>ΕΜΑΙL: {user?.email}</h1>
      <h1>REGISTRY: {user?.registryName}</h1>
    </>
  );
}
