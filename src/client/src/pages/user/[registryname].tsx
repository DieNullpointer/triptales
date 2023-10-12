import Image from "@/components/atoms/Image";
import { getUser, getUserByRegistry } from "@/middleware/middleware";
import { useRouter } from "next/router";

import defaultBanner from "@/resources/default_bannerpic.jpg";

export default function User() {
  const router = useRouter();
  const registryname: any = router.query?.registryname;
  const { user, error, isLoading } = getUserByRegistry(registryname);

  return (
    <div className="">
      <Image src={defaultBanner.src} alt="" className="w-full" wrapper="max-h-60 overflow-hidden items-center flex rounded-lg" />
    </div>
  );
}
