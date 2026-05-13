import { currentUser } from "@clerk/nextjs/server";

import LeftSidebarLinks from "./LeftSidebarLinks";

const LeftSidebar = async () => {
  const user = await currentUser();

  return <LeftSidebarLinks userId={user?.id} />;
};

export default LeftSidebar;
