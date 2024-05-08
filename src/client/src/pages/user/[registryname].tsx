import { getUserByRegistry } from "@/middleware/middleware";
import { useRouter } from "next/router";
import { Flowtext, IconText, Subheading } from "@/components/atoms/Text";
import Loading from "@/components/static/Loading";
import Spacing from "@/components/atoms/Spacing";
import Container from "@/components/atoms/Container";
import { Key, useEffect, useState } from "react";
import { getAuthorized } from "@/helpers/authHelpers";
import Follow from "@/components/static/Follow";
import Button from "@/components/atoms/Button";
import ProfileHeader from "@/components/molecules/ProfileHeader";
import Post from "@/components/organisms/Post";
import { TripPost } from "@/types/types";

export default function User() {
  const router = useRouter();
  const registryname: any = router.query?.registryname;
  const [ownProfile, setOwnProfile] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const { user, profile, banner } = getUserByRegistry(registryname);

  const init = async () => {
    caches.delete("admin-profile.jpg");
    caches.delete("admin-banner.jpg");
    const loggedInUser = await getAuthorized();
    setAuthorized(loggedInUser ? true : false);
    setOwnProfile(authorized && loggedInUser === user?.registryName);
  };

  useEffect(() => {
    init();
  });

  useEffect(() => {
    if (user) setFollowers(user.followerCount);
  }, [user]);

  const [followers, setFollowers] = useState<number>(0);

  return user ? (
    <div>
      <ProfileHeader banner={banner} profile={profile} />
      <div className={banner ? "mt-16" : "mt-4"}>
        <Subheading bold center className="!tracking-wider">
          {user?.displayName}
        </Subheading>
        <Flowtext className="italic !text-slate-600" center>
          @{user?.registryName}
        </Flowtext>
      </div>
      <Spacing space={4} />
      <div className="grid gap-8 auto-cols-fr md:grid-cols-2">
        <Container className="flex flex-col !p-4" sectionMarker>
          <Flowtext italic bold>
            About this User
          </Flowtext>
          <Spacing space={1.5} />
          <Flowtext className="!text-sm md:!text-base">
            {user?.description}
          </Flowtext>
          {user?.origin || user?.favDestination ? <Spacing space={6} /> : <></>}
          {user?.origin ? (
            <>
              <IconText
                className="!text-sm"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                Resides in <b>{user.origin}</b>
              </IconText>
              <Spacing space={2} />
            </>
          ) : (
            <></>
          )}
          {user?.favDestination ? (
            <>
              <IconText
                className="!text-sm"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                }
              >
                Loves visiting <b>{user.favDestination}</b>
              </IconText>
            </>
          ) : (
            <></>
          )}
        </Container>
        <Container
          className="flex justify-start space-y-2 flex-col"
          sectionMarker
        >
          {authorized && !ownProfile ? (
            <Follow
              registryName={user.registryName}
              active={user.follow}
              onClick={(active) => {
                setFollowers(active ? followers - 1 : followers + 1);
              }}
            />
          ) : (
            <></>
          )}
          <Flowtext center className="!text-sm">
            Followers: {followers}
          </Flowtext>
          <Flowtext center className="!text-sm">
            Following: {user.followingCount}
          </Flowtext>
        </Container>
      </div>
      {authorized && ownProfile ? (
        <Container>
          <Spacing space={4} />
          <Button
            onClick={() => {
              router.push("/post/new");
            }}
            className="!w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Create Post
          </Button>
        </Container>
      ) : (
        <></>
      )}
      <Spacing space={12} />
      {user?.posts?.[0] ? (
        <>
          <Flowtext bold wide uppercase center>
            posts by {user.displayName}
          </Flowtext>
          {user.posts.map((post: TripPost, idx: Key | null | undefined) => (
            <Post key={idx} data={post} userGiven={{profilePicture: profile, ...user}} small />
          ))}
        </>
      ) : (
        <Flowtext light italic center>
          {user.displayName} has not posted anything yet.
        </Flowtext>
      )}
    </div>
  ) : (
    <Loading timeout />
  );
}
