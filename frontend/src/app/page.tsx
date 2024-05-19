import { Button } from "@nextui-org/react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  // redirect to login if not authenticated
  if (!session) {
    redirect("/auth/login");
  } else redirect("/conversation");
  
  

}
