"use client";
import React, { useEffect } from "react";
import {Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem, Link, Button,Image,Avatar,DropdownItem,DropdownTrigger,Dropdown,DropdownMenu} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useAtom } from "jotai";
import { isMiniSidebarOpenedAtom } from "~/atoms";
import Sub from "./sub";
import {useTheme} from "next-themes";

export default function Navbarbar() {
  const menuItems = [
    "Profile",
    "Settings",
    "Log Out",
  ];



  const { data: session, status } = useSession()
  console.log(status)
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Navbar disableAnimation isBordered>

      <NavbarContent className="sm:hidden pr-3" justify="start">
        <NavbarBrand >
          <Image src="/assets/lguide.png" width={50} height={50} />
          <p className="font-bold text-inherit">L'GuideAI</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Image src='/assets/lguide.png' width={50} height={50}/>
          <p className="font-bold text-inherit">L'GuideAI</p>
        </NavbarBrand>  
      </NavbarContent>

      <NavbarContent as="div" justify="end" >
        <Image src={theme === 'dark' ? '/assets/sun.png' : '/assets/moon.png'} onClick={toggleTheme} width={20} height={20} />
      </NavbarContent>

{   status === "authenticated" &&
<NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={signOut}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>}

    </Navbar>
  );
}
