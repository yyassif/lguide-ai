
"use client";
import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { geolocationAtom } from '~/atoms'
import { Image,Input, Accordion, AccordionItem } from "@nextui-org/react";

export default function MessageBox(
  {
    conversationId,
    func
  }: { conversationId: string | null, func: any
    
  }
) {
  const [geolocationData, setGeolocationData] = useAtom(geolocationAtom)
  useEffect(() => {
    let freqTimeout = null;
    if('geolocation' in navigator) {
      freqTimeout = setInterval(() => {
          navigator.geolocation.getCurrentPosition(({ coords }) => {
            const { latitude, longitude } = coords
            setGeolocationData({ lat: latitude, lng: longitude })
          }, (error) => {
            console.error(error)
          }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          })
        }, 5000)
    }

    return () => {
      if(freqTimeout) clearInterval(freqTimeout)
    }
  }, [])

  const submit = async () => {
    if(!prompt) {
      setIsPromptEmpty(true)
      return
    }
    await func(prompt, 
        selectedServiceType!=undefined ? serviceTypes[selectedServiceType].name : '', 
        selectedTransport!=undefined ? transportationMeans[selectedTransport].name : ''
      , geolocationData)
  }
 

  
  const transportationMeans = [
    {
      name: 'Car',
      icon: '/assets/car.png'
    },
    {
      name: 'Walking',
      icon: '/assets/walking.png'
    }
  ]

  const serviceTypes = [
    {
      name: 'Grocery',
      icon: '/assets/grocery.png'
    },
    {
      name: 'IT',
      icon: '/assets/it.png'
    },
    {
      name: 'Resturant',
      icon: '/assets/resturant.png'
    },
    {
      name: 'Bank',
      icon: '/assets/bank.png'
    },
    {
      name:'Hospital',
      icon: '/assets/hospital.png'
    },
    {
      name: 'Pharmacy',
      icon: '/assets/pharmacy.png'
    },
    {
      name:'Other',
      icon: '/assets/other.png'
    }
  ]

  const [isPromptEmpty, setIsPromptEmpty] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [selectedTransport, setSelectedTransport] = useState<number | undefined>(undefined);
  const [selectedServiceType, setSelectedServiceType] = useState<number | undefined>(undefined);

  return       <div className="flex flex-col w-full">
  <Input
        variant="bordered"
        label="Message"
        labelPlacement="inside"
        isInvalid={isPromptEmpty}
        placeholder="Type your request here"
        errorMessage="Please fill your request"
        endContent={
            <button className="focus:outline-none pb-[6px] " type="button" onClick={submit}>
            <Image className="text-2xl text-default-400 pointer-events-none" src='/assets/send.png' />
            </button>
        }
        type='text'
        className="w-full  "
        value={prompt}
        onChange={(e) => {
          setIsPromptEmpty(false)
          setPrompt(e.target.value)}}
    />
    <Accordion isCompact className="my-1">
      <AccordionItem key="1" aria-label="Advanced Options" title="Advanced Options">
        <div className="flex xl:flex-row xl:gap-20 gap-4 flex-col ">
          <div className="flex flex-col gap-2 ">
            <p className="text-xl">Type</p>
            <div className="md:flex md:flex-start gap-2 grid sm:grid-cols-3 grid-cols-2">
              {
                serviceTypes.map((serviceType, index) => {
                  return <div key={index} className={"w-[85px] h-[85px] bg-white  flex flex-col justify-center items-center gap-[2px] rounded-2xl border-[2px] select-cursor cursor-pointer" 
                    + (selectedServiceType === index ? ' border-primary-500' : ' border-default-200' )
                  }
                    onClick={() => {setSelectedServiceType(index)}}
                  >
                    <Image src={serviceType.icon} alt={serviceType.name} width={40} height={40} />
                    <p className=" text-sm">{serviceType.name}</p>
                  </div>
                })
              }
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <p className="text-xl">Mean of transportation</p>
          <div className=" md:flex md:flex-start gap-2 grid sm:grid-cols-3 grid-cols-2 ">
            { transportationMeans.map((transportationMean, index) => {
              return <div key={index} className={"w-[85px] h-[85px] bg-white  flex flex-col justify-center items-center gap-[2px] rounded-2xl border-[2px] select-cursor cursor-pointer" 
                + (selectedTransport === index ? ' border-primary-500' : ' border-default-200' )
              }
                onClick={() => {setSelectedTransport(index)}}
              >
                <Image src={transportationMean.icon} alt={transportationMean.name} width={40} height={40} />
                <p className=" text-sm">{transportationMean.name}</p>
              </div>
              })
            }
          </div>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  </div>
}