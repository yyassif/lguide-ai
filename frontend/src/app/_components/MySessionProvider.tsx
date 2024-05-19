"use client"

import { NextUIProvider } from "@nextui-org/react"
import { useAtom } from "jotai";
import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"
import { isMiniSidebarOpenedAtom } from "~/atoms";
import {ThemeProvider as NextThemesProvider} from "next-themes";

export default function MySessionProvider({
  children, session
}:any) {

  return (
    <SessionProvider session={session}>
      <NextUIProvider >
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div className="h-[calc(100vh-30px)] w-[100vw]">
          {children}
        </div>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  )
}