import { api } from "~/trpc/server";
import SideBar from "../_components/sidebar";


export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await api.conversation.getConversations();

  return (
    <div className="flex flex-row w-full h-[calc(100%-35px)] relative ">
      <SideBar  conversations={conversations}/>
      {children}
    </div>  );
}
