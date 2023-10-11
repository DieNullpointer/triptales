import { getUser, getUserByRegistry } from "@/middleware/middleware";
import { useRouter } from "next/router";

export default function User() {
    const router = useRouter();
    const registryname:any = router.query?.registryname;
  const { user, error, isLoading } = getUserByRegistry(registryname);
  
  return (
    <>
      <h1>USER: {user?.displayName}</h1>
      <h1>ΕΜΑΙL: {user?.email}</h1>
      <h1>REGISTRY: {user?.registryName}</h1>
    </>
  );
}
