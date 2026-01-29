import { ReactNode } from "react";
import { SidebarComponent, SidebarContentComponent } from "@components";
import { CalendarDaysIcon, CubeIcon, HomeModernIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";

export default function ExampleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex">
        <SidebarComponent
          basePath="/dashboard"
          head={
            <div className="px-4">
              <a href="#" className="text-2xl font-extrabold italic">
                BOOKING SYSTEM
              </a>
              <p className="text-sm -mt-1 font-semibold text-slate-400">
                Dashboard Panel
              </p>
            </div>
          }
          items={[
            {
              label: "WELCOME",
              items: [
                {
                  label: "Dashboard",
                  path: "/",
                  leftContent: <HomeModernIcon className="w-5 h-5" />,
                },
              ],

            },
            {
              label: "Master Data",
              collapse: true,
              items: [
                {
                  label: "User",
                  path: "/user",
                  leftContent: <UserIcon className="w-5 h-5" />,
                },
                {
                  label: "Role",
                  path: "/role",
                  leftContent: <UserGroupIcon className="w-5 h-5" />,
                },
              ],
            },
            {
              label: "Transactions",
              collapse: true,
              items: [
                {
                  label: "Resource",
                  path: "/resource",
                  leftContent: <CubeIcon className="w-5 h-5" />,
                },
                // {
                //   label: "Schedule",
                //   path: "/schedule",
                // },
                {
                  label: "Booking",
                  path: "/booking",
                  leftContent: <CalendarDaysIcon className="w-5 h-5" />,
                },
              ],
            },
          ]}
        />
        <SidebarContentComponent>
          <div className="p-2 lg:p-4">{children}</div>
        </SidebarContentComponent>
      </div>
    </>
  );
}
