
import React from 'react';
import { Flowtext, Subheading } from '../atoms/Text';
import Link from 'next/link';
import Avatar from '../atoms/Avatar';

export interface Props {
    user: {displayName: string, registryName: string, profilePicture: string};
}

const SmallProfile: React.FC<Props> = ({user}) => {
    return (
        <div className="place-items-center flex flex-row">
          <Avatar profile={user.profilePicture} size="small" />
          <div className="p-2 rounded ml-1">
            <Subheading bold className="!text-base md:!text-xl">
              {user.displayName}
            </Subheading>
            <Link href={`/user/${user.registryName}`}><Flowtext
              italic
              className="!text-slate-600 !text-sm md:!text-sm -mt-1"
            >
              @{user.registryName}
            </Flowtext></Link>
          </div>
        </div>
    );
};

export default SmallProfile;
