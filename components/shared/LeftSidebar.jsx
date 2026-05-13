import { currentUser } from "@clerk/nextjs/server";

import LeftSidebarLinks from "./LeftSidebarLinks";

const LeftSidebar = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  return <LeftSidebarLinks userId={user?.id} />;
};

export default LeftSidebar;
