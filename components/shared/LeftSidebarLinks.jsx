"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, Show } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";

const LeftSidebarLinks = ({ userId }) => {
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const route =
            link.route === "/profile" ? `/profile/${userId}` : link.route;

          const isActive =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;

          return (
            <Link
              href={route}
              key={link.label}
              className={`leftsidebar_link ${isActive ? "bg-primary-500" : ""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <Show when="signed-in">
          <SignOutButton redirectUrl="/sign-in">
            <button type="button" className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />

              <p className="text-light-2 max-lg:hidden">Logout</p>
            </button>
          </SignOutButton>
        </Show>
      </div>
    </section>
  );
};

export default LeftSidebarLinks;
