"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth"; // Assuming this component manages user address and dropdown
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-primary text-white shadow-lg" : ""
              } hover:bg-primary hover:text-white transition-all duration-300 ease-in-out focus:bg-primary py-2 px-4 rounded-full gap-2 flex items-center`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky top-0 navbar bg-white shadow-md flex-shrink-0 justify-between z-20 px-4 py-2">
      <div className="navbar-start w-auto lg:w-1/2 flex items-center">
        {/* Mobile Burger Menu */}
        <div className="lg:hidden" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`btn btn-ghost ${isDrawerOpen ? "hover:bg-primary" : "hover:bg-transparent"}`}
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52"
              onClick={() => setIsDrawerOpen(false)}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>

        {/* Logo */}
        <Link href="/" passHref className="flex items-center gap-2 ml-4">
          <div className="flex relative w-12 h-12">
            <Image alt="Logo" className="cursor-pointer" fill src="/logo.png" /> {/* Use logo.png here */}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900">VoxPopuli</span> {/* Update title if necessary */}
            <span className="text-sm text-gray-500">La tua app per le segnalazioni</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex menu menu-horizontal px-1 gap-4 ml-6">
          <HeaderMenuLinks />
        </ul>
      </div>

      {/* User Dropdown & Connect Button */}
      <div className="navbar-end flex-grow flex justify-end items-center gap-4">
        <RainbowKitCustomConnectButton />
        {/* You can add user dropdown here if it’s a separate component */}
      </div>
    </div>
  );
};
