/* eslint-disable @next/next/no-img-element */
import React from "react";
import clsx from "clsx";
import {signOut} from "next-auth/react";
import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
  PhotoIcon,
  PlusIcon as PlusIconOutline,
  Squares2X2Icon as Squares2X2IconOutline,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {useRouter} from "next/router";

const navigation = [
  {name: "Tables", href: "/", icon: HomeIcon, current: false},
  /* {name: "Menu", href: "/menu", icon: Squares2X2IconOutline, current: false},
  {name: "Commandes", href: "/orders", icon: PhotoIcon, current: true}, */
];
export default function Layout({children}: any) {
  const router = useRouter();
  return (
    <>
      <div className="hidden shadow-lg fixed inset-y-0  h-screen overflow-y-hidden w-36 bg-slate-20 border-r md:block">
        <div className="flex w-full flex-col items-center py-6 ">
          <div className="text-5xl font-extrabold bg-slate- mb-6  flex items-center justify-center w-full shadow-2xl border">
            <svg
              fill="#000000"
              width="200px"
              height="100px"
              viewBox="-5 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="shadow-xl p-2 bg-slate-50 border"
            >
              <path d="m1.44 24c-.795 0-1.44-.645-1.44-1.44v-16.904c0-.795.645-1.44 1.44-1.44h1.705.001c.054 0 .106.013.151.036l-.002-.001v-4.082-.001c0-.093.075-.168.168-.168h.001 6.018.001c.093 0 .168.075.168.168v.001 4.058c.024-.006.052-.01.08-.01h1.515c.795 0 1.44.645 1.44 1.44v4.031c.042-.021.092-.033.145-.033h.001.756c.186 0 .337.151.337.337v8.772c0 .186-.151.337-.337.337h-.756-.001c-.053 0-.102-.012-.147-.034l.002.001v3.492c0 .795-.645 1.44-1.44 1.44zm7.324-3.231v1.134c0 .093.076.169.169.169h1.334c.093 0 .169-.076.169-.169v-1.134c0-.093-.076-.168-.169-.168h-1.336c-.093 0-.168.075-.169.168zm-3.156 0v1.134c0 .093.076.169.169.169h1.333c.093 0 .169-.076.169-.169v-1.134c0-.093-.076-.168-.169-.168h-1.334c-.093 0-.168.075-.169.168zm-3.156 0v1.134.001c0 .093.075.168.168.168h1.334c.093 0 .169-.076.169-.169v-1.134c0-.093-.076-.168-.169-.168h-1.334c-.093 0-.168.075-.168.168zm6.311-2.571v1.134c0 .093.076.169.169.169h1.334c.093 0 .169-.076.169-.169v-1.134-.001c0-.093-.075-.168-.168-.168h-.001-1.335-.001c-.093 0-.168.075-.168.168v.001zm-3.156 0v1.134c0 .093.076.169.169.169h1.334c.093 0 .169-.076.169-.169v-1.134-.001c0-.093-.075-.168-.168-.168h-.001-1.334-.001c-.093 0-.168.075-.168.168zm-3.156 0v1.134.001c0 .093.075.168.168.168h1.334c.093 0 .169-.076.169-.169v-1.134-.001c0-.093-.075-.168-.168-.168h-.001-1.334c-.093 0-.168.075-.168.168zm6.311-2.572v1.134.001c0 .093.075.168.168.168h.001 1.334.001c.093 0 .168-.075.168-.168v-.001-1.134c0-.093-.076-.168-.169-.168h-1.334c-.093 0-.168.075-.169.168zm-3.156 0v1.134.001c0 .093.075.168.168.168h.001 1.334.001c.093 0 .168-.075.168-.168v-.001-1.134c0-.093-.076-.168-.169-.168h-1.334c-.093 0-.168.075-.169.168zm-3.156 0v1.134.001c0 .093.075.168.168.168h1.335.001c.093 0 .168-.075.168-.168v-.001-1.134c0-.093-.076-.168-.169-.168h-1.334c-.093 0-.168.075-.168.168zm-.21-6.713v4.911.001c0 .093.075.168.168.168h.001 7.76.001c.093 0 .168-.075.168-.168v-.001-4.911c0-.093-.076-.169-.169-.169h-7.76c-.093 0-.169.076-.169.169zm-.504-2.682v1.189.001c0 .279.226.505.505.505h.001 8.398c.279 0 .505-.226.505-.505v-.001-1.189c0-.279-.226-.505-.505-.505h-.99v1.01h.488v.178h-7.392v-.178h.32.001c.084 0 .164-.021.233-.057l-.003.001v-.898c-.067-.035-.146-.056-.231-.056 0 0 0 0-.001 0h-.826c-.278 0-.504.226-.504.505z" />
            </svg>
            {/*   <span className="bg-clip-text text-transparent bg-black">POS</span> */}
          </div>
          <div className="mt-6 w-full flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  router.pathname.endsWith(item.href)
                    ? "bg-[#4A5C2F] text-white"
                    : "text-white hover:bg-indigo-800 bg-slate-500 hover:text-white",
                  "group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
                )}
              >
                <item.icon
                  className={clsx(
                    router.pathname.endsWith(item.href)
                      ? "text-white"
                      : "text-white group-hover:text-white",
                    "h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                <span className="mt-2">{item.name}</span>
              </Link>
            ))}
          </div>
          <button
            onClick={() => signOut()}
            className="hover:bg-indigo-900 absolute bottom-12 p-3 mx-4 group  group w-full text-black rounded-md flex flex-col items-center font-medium"
          >
            <ArrowRightOnRectangleIcon
              className={clsx("text-black group-hover:text-white", "h-6 w-6")}
            />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      <div className="ml-36 ">{children}</div>
    </>
  );
}
