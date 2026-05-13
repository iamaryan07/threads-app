import { OrganizationSwitcher, Show, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <Show when="signed-in">
            {/* <SignOutButton redirectUrl="/sign-in">
              <button type="button" className="flex cursor-pointer gap-4 p-4">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </button>
            </SignOutButton> */}
            <SignOutButton redirectUrl="/sign-in">
              <span className="text-light-2 mr-2">Logout</span>
            </SignOutButton>
          </Show>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            variables: {
              colorText: "white",
            },
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar;
