import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = async ({ params }) => {
  const { id } = await params;
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <>
      <section className="text-light-2">
        <ProfileHeader
          accountId={userInfo.id}
          authUserId={user.id}
          name={userInfo.name}
          username={userInfo.username}
          imgUrl={userInfo.image}
          bio={userInfo.bio}
        />

        <div className="mt-9 w-full">
          <Tabs defaultValue="threads" className="w-full">
            <TabsList className="mx-auto flex w-fit gap-2">
              {profileTabs.map((tab) => (
                <TabsTrigger
                  key={tab.label}
                  value={tab.value}
                  className="
            flex items-center gap-2 rounded-lg px-4 py-2
            text-light-2 data-[state=active]:bg-primary-500
            data-[state=active]:text-light-1
          "
                >
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={20}
                    height={20}
                    className="object-contain"
                  />

                  <p className="max-sm:hidden text-small-medium">{tab.label}</p>

                  {tab.label === "Threads" && (
                    <p className="ml-1 rounded-full bg-dark-4 px-2 py-0.5 text-tiny-medium text-light-1">
                      {userInfo.threads.length}
                    </p>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="threads" className="mt-8 w-full text-light-1">
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>

            <TabsContent value="replies" className="mt-8 w-full text-light-1">
              <p>Replies</p>
            </TabsContent>

            <TabsContent value="tagged" className="mt-8 w-full text-light-1">
              <p>Tagged</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default Page;
