import { Card, CardBody, CardHeader, Divider ,CardFooter } from "@nextui-org/react";
import MessageBox from "./_components/messageBox";

export default function ConversationDefault(){
  
  return (
    <Card 
      className="h-[calc(100%-4px)] radius-2xl mx-[4px] pl-[10px] my-[2px] w-full"
    >
      <CardHeader>
        <h1>Conversation</h1>
      </CardHeader>
      <Divider />
      <CardBody className="flex justify-center items-center">
        <p className="text-center font-bold text-lg text-gray-500">
          Select a conversation or create a new one
        </p>
      </CardBody>
      <CardFooter className="pb-1 mb-1">
        {/* <MessageBox conversationId={null} func={undefined} /> */}
      </CardFooter>
    </Card>
  );
}