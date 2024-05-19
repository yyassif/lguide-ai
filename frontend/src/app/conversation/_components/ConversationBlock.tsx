"use client";
import { Avatar, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import MessageBox from '../_components/messageBox';
import UserPrompt from "~/app/_components/userprompt";
import AIResponse from "~/app/_components/ai-response";
import {ScrollShadow} from "@nextui-org/react";
import { ReactNode, useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function ConversationBlock({ messages, conversationId }:
  {
    messages: any,
    conversationId: string
  }
){
  const useMutation = api.conversation.sendMessage.useMutation();
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const [content, setContent] = useState<ReactNode[]>([])

  const [overview, setOverview] = useState<string>('')

  const [prompt , setPrompt] = useState<string>('')

  useEffect(() => {
    console.log(messages)
    if(messages && messages.length > 0) {
      setOverview(messages[0].overview)
      setPrompt(messages[0].query )
      setContent(messages[0].place.map((message, index) => {
        return <AIResponse key={index+1}
          address={message.place.address ?? "No address found"}
          phone={message.place.phone ?? "No phone found"}
          overview={message.place.overview ?? "No overview found"}
          rating={message.place.rating ?? "No rating found"}
          website={message.place.website ?? "No website found"}
          image={message.place.image_url ?? "No image found"}
          name={message.place.name ?? "No name found"}
          // details={message.place.details ?? "No details found"}
          longitude={message.longitude}
          latitude={message.latitude}
          isLoaded={
            message.status != 'pending'
          } />
      }))
      setIsLoaded(true)
    }
  }, [])

  const onSubmitFunction = async (prompt: string, selectedServiceType: string, selectedTransport: string, geolocationData: any) => {
    console.log('submit')
    console.log(prompt, selectedServiceType, selectedTransport, geolocationData)

    setContent([])
    setPrompt(prompt)

    setIsLoaded(false)

    const data = await useMutation.mutateAsync({
      conversationId: parseInt(conversationId),
      prompt: prompt,
      serviceType: selectedServiceType,
      transportationMean: selectedTransport,
      location: {
        lat: geolocationData.lat,
        lng: geolocationData.lng
      }
    })

    if(!data) {
      console.log('No data')
      return
    }

    console.log(data)

    setOverview(data.overview)
    
    console.log(content)
    setContent((prev) => [  
      ...prev,
      ...data.place.map((message, index) => {
        return <AIResponse key={index+2}
        address={message.address ?? "No address found"}
        phone={message.phone ?? "No phone found"}
        overview={message.overview ?? "No overview found"}
        rating={message.rating ?? "No rating found"}
        website={message.website ?? "No website found"}
        image={message.image_url ?? "No image found"}
        name={message.name ?? "No name found"}
        details={message.details ?? "No details found"}
        longitude={message.longitude}
        latitude={message.latitude}
        isLoaded={true} />
      })])

    console.log(content)
    
    setIsLoaded(true);
  }

  useEffect(() => {
    console.log(isLoaded)
  }, [isLoaded])

  useEffect(() => {
    console.log(overview)
  }, [overview])

  useEffect(() => {
    console.log("ef")
  }, [])

  return <>
  <CardBody className="flex-1 min-h-[0px] p-3">
    <ScrollShadow hideScrollBar className="w-full">
      {
        prompt !== '' ? (
          <>
            <UserPrompt message={prompt} />
            <div className='flex w-full justify-start gap-3 ' key={1}>
              <div className='w-full flex pt-6 gap-2 px-3'>
                <Avatar
                    isBordered
                    className="transition-transform items-center justify-center"
                    color="secondary"
                    name="Jason Hughes"
                    size="sm"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
                <Skeleton isLoaded={isLoaded} className="rounded-2xl w-[80%] min-h-[40px]">
                  <div className='min-h-[20px] border-[5px] rounded-2xl bg-slate-200   '>
                      <p className='p-2 text-black'>   
                          {overview}    
                      </p>
                  </div>
                </Skeleton>
                </div>
            </div>
          </>
          
        ) : null
      }
      {content}
    </ScrollShadow>
  </CardBody>
  <CardFooter className="pb-1 mb-1">
    <MessageBox conversationId={conversationId ?? null} func={onSubmitFunction} />
  </CardFooter>
</>
} 