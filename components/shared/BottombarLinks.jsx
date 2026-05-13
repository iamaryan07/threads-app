import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Bottombar from "./Bottombar";

const BottombarLinks = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  return <Bottombar userId={user.id} />;
};

export default BottombarLinks;
