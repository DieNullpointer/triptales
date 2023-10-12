import Image from "@/components/atoms/Image";
import { getUser, getUserByRegistry } from "@/middleware/middleware";
import { useRouter } from "next/router";

import defaultBanner from "@/resources/default_bannerpic.jpg";
import defaultPfp from "@/resources/default_profilepic.png";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";

export default function User() {
  const router = useRouter();
  const registryname: any = router.query?.registryname;
  const { user, error, isLoading } = getUserByRegistry(registryname);

  return (
    <div className="">
      <div className="relative">
        <Image
          src={defaultBanner.src}
          alt=""
          className="w-full"
          wrapper="max-h-60 overflow-hidden items-center flex rounded-lg"
        />
        <Image
          src={defaultPfp.src}
          alt=""
          height={110}
          width={110}
          className="rounded-full ring-8 ring-white"
          wrapper="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        />
      </div>
      <div className="mt-16">
        <Subheading bold wide center>
          {user.displayName}
        </Subheading>
        <Flowtext className="italic !text-slate-600" center>@{user.registryName}</Flowtext>
      </div>
    </div>
  );
}
