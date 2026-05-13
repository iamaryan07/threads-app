import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo) {
    redirect("/onboarding");
  }

  return (
    <>
      <div className="text-light-2">Post a Thread </div>
      <PostThread userId={userInfo._id.toString()} />
    </>
  );
};

export default Page;
