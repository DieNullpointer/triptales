import Image from "@/components/atoms/Image";
import { getUser, getUserByRegistry } from "@/middleware/middleware";
import { useRouter } from "next/router";

import Loading from "@/components/static/Loading";
import Avatar from "@/components/atoms/Avatar";

export default function Settings() {
    const router = useRouter();
    const user = null;


    return user ? (
        <div>
        <Avatar profile={profile} size="large" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
        </div>

    ) : (
        <Loading />
    );
}