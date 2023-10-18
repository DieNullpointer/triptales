import Post from "@/components/organisms/Post";
import { getPost } from "@/middleware/middleware";
import { useRouter } from "next/router";

export default function PostPage() {
  const router = useRouter();
  const guid: any = router.query?.guid;
  const { post, error, isLoading } = getPost(guid);
  console.log(post);
  return (
    <>
      <Post data={post} />
    </>
  );
}
