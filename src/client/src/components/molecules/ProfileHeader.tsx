import React from "react";
import Avatar from "../atoms/Avatar";
import Image from "../atoms/Image";

const ProfileHeader: React.FC<{ banner: any; profile: any }> = ({
  banner,
  profile,
}) => {
  return (
    <div className="relative">
      {banner && (
        <Image
          src={banner!}
          alt=""
          className="w-full"
          wrapper="max-h-60 overflow-hidden items-center flex rounded-lg"
        />
      )}
      <Avatar
        profile={profile}
        size="large"
        className={
          banner
            ? "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
            : "w-full flex justify-center"
        }
      />
    </div>
  );
};

export default ProfileHeader;
