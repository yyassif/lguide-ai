import React from 'react'
import { Avatar,Card,CardHeader,CardBody, Image,CardFooter,Button } from '@nextui-org/react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import Link from 'next/link'
import { Skeleton } from '@nextui-org/react'
import { useAtom } from 'jotai'
import { geolocationAtom } from '~/atoms'
type AIResponseProps = {
    overview : string,
    details: string,
    name: string,
    phone: string,
    website: string,
    rating: number|string,
    image: string,
    address: string,
    isLoaded: boolean,
    latitude: number,
    longitude: number
}

function AIResponse(props: AIResponseProps) {
    const [geolocation, setGeolocation] = useAtom(geolocationAtom)
    const center = {
        lat: geolocation.lat,
        lng: geolocation.lng
    }
    const corrds = {
        lat:props.latitude,
        lng:props.longitude
    }
    const mapContainerStyle = {
        width: '50vw',
        height: '50vh',
    }
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAbT9GTaIaNHEtVYXqhJtq17FoJ3-BYRso',
      });
    if (loadError) {
        return <div></div>;
    }
    if (!isLoaded) {
        return <div></div>;
    }
  return (
        <div className='flex w-full justify-start gap-3 pb-5 '>
    <div className='w-full flex pt-6 gap-2 px-3'>
        <Avatar
            isBordered
            className="transition-transform items-center justify-center"
            color="secondary"
            name="Jason Hughes"
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
          <div className='flex flex-col md:w-[75%] w-full '>
            <Skeleton isLoaded={props.isLoaded} className={"rounded-2xl w-full mt-3"+ (props.isLoaded ? ' ' : ' h-[100px]')}>
            <div className="max-w-[900px] gap-2 grid grid-cols-12 ">
                <Card className="w-full min-h-[30px] bg-slate-200 col-span-12 sm:col-span-8 text-black">
                    <CardBody>
                        <p>
                            {props.overview}
                        </p>
                    </CardBody>
                </Card>
                <Card className="w-full h-[300px] col-span-12 sm:col-span-5">
                    <CardBody className="grid grid-cols-2 ">
                        <h4 className='font-bold'>Name</h4>
                        <Link href={props.website} target='blank'>
                            {props.name}
                        </Link>
                        <h4 className='font-bold'>Rating</h4>
                        <div className=' flex '>
                            <p>{props.rating}</p>
                            <Image src ='/assets/star.png' width={20} height={20} />
                        </div>
                        <h4 className='font-bold'>Phone Number</h4>
                        <p>{props.phone}</p>
                    </CardBody>
                </Card>
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src={props.image}
                    />
                </Card>
                
                <Card isFooterBlurred className="w-full h-[250px] col-span-12 sm:col-span-7">
                
                <GoogleMap
                    center={corrds}
                    mapContainerStyle={mapContainerStyle}
                    zoom={13}
                    options={{ disableDefaultUI: true }}
                >
                    <Marker position={corrds} />
                </GoogleMap>
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                    <div className="flex flex-col">
                        <p className="text-tiny text-white/60">{props.address}</p>
                    </div>
                    </div>
                    <Link href={`https://www.google.com/maps/dir/?api=1&origin=${center.lat}%2C${center.lng}&destination=${props.latitude}%2C${props.longitude}&travelmode=driving`} target='blank'>
                    <Button radius="full" size="sm" >Open Map</Button>
                    </Link>
                </CardFooter>
                </Card>
            </div>
            </Skeleton>
          </div>
        </div>
        

    </div>
  )
}

export default AIResponse
export type { AIResponseProps }