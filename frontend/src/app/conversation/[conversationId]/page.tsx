import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import MessageBox from '../_components/messageBox';
import { api } from "~/trpc/server";
import ConversationBlock from "../_components/ConversationBlock";

export default async function ConversationDefault({ params }:
  {
    params: {
      conversationId: string
    }
  }
){

  const messages = await api.conversation.getConversation({
    conversationId: parseInt(params.conversationId)
  });

  return <Card 
    className="h-[calc(100%-4px)] radius-2xl mx-[4px] pl-[10px] my-[2px] w-full"
  >
  <CardHeader>
    <h1 className="font-bold">Conversation</h1>
  </CardHeader>
  <Divider />
  <ConversationBlock messages={messages} conversationId={params.conversationId} />
</Card>
} 