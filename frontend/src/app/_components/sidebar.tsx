"use client";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider,Image } from '@nextui-org/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { signOut, useSession } from "next-auth/react";
import { api } from '~/trpc/react';

function SideBar(
  { conversations }:
  {
    conversations: any
  }
) {

  const router = useRouter()

  const [history, setHistory] = useState<any[]>(conversations.map((item) => ({
    id: item.id,
    title: item.name,
    date: ((new Date().getTime()- new Date(item.createdAt).getTime()) / 60000).toFixed(0) + "m ago"
  })))

  const [isShowing, setIsShowing] = useState(window.innerWidth >= 768)

  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [])

  useEffect(() => {
    setIsShowing(window.innerWidth >= 768)
  }, [window.innerWidth])

  
  const mutation = api.conversation.addConversation.useMutation({})
  
  return (
<>
    <Card className={" h-[calc(100%-4px)] z-[50] flex-col radius-none radius-r-2xl -ml-[10px] pl-[10px] my-[2px] transition-all duration-300 ease-in-out "
      + (
        width >= 768 && "min-w-[250px] max-[400px] w-[22%] flex" 
        // (isShowing && width < 768) ? "w-[250px] hidden md:flex":
        // ? "min-w-[250px] max-[400px] w-[22%] hidden md:flex" 
        // : "w-full"
      ) + (
        width < 768 && isShowing ? "md:flex absolute w-[80%]  " : "w-[5%]"
      )

    }>
{ !isShowing ? 

      <CardHeader>
        <Button onClick={()=>setIsShowing(true)} className='min-w-[10px] p-0 m-0 bg-transparent'>
          <Image src='/assets/menuclosed.png'width={30} height={30}/>
        </Button>
      </CardHeader>
    :<>
      <CardHeader>
        <div className='flex justify-between items-center w-full '>
            <h1 className="font-bold">
            Chat History</h1>
            {
              width < 768 && 
              <Button onClick={() => setIsShowing(false)} className="min-w-[10px] p-0 m-0 bg-transparent" >
                <Image src='/assets/menuopen.png' width={30} height={30}/>
              </Button>
            }
        </div>
      </CardHeader>
      <Divider />
      
      <CardBody>
        
          <Link href='/conversation' className='pb-2' onClick={async () => {
             const res = await mutation.mutateAsync()
              history.push({
                id: res.id,
                title: res.name,
                date: ((new Date().getTime()- new Date(res.createdAt).getTime()) / 60000).toFixed(0) + "m ago"
              })
              await router.push(`/conversation/${res.id}`)
          }}>
              <div className='flex items-center w-full cursor-pointer hover:bg-gray-100 mx-1 p-2 rounded-2xl'>
                <p>New Conversation</p>
                <Image src='/assets/plus.png' width={30} height={30} className="ps-2"/>
              </div>
          </Link>
          
        <Divider />
        <div className="flex flex-col gap-1">
          {history.map((item, index) => (
            <Link key={index} href={`/conversation/${item.id}`} onClick={() =>{
              if(width < 768) setIsShowing(false)
            }} >
              <div className="flex flex-col cursor-pointer hover:bg-gray-100 mx-1 p-2 rounded-2xl">
                <p>{item.title}</p>
                <p className="text-sm">
                  {item.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardBody>
      <CardFooter className="px-8">
        <Button href="/auth/login" className=" w-full" color="danger" onClick={signOut} >
          Log Out
        </Button>
      </CardFooter>
      </>
    }
    </Card>
  </>
  )
}

export default SideBar