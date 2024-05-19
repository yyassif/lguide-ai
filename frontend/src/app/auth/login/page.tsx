'use client'
import React, { useState } from "react";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image,Button,Input} from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";



export default function App() {
    const [isVisible, setIsVisible] = useState(false);

    const { data: session, status } = useSession();
    // if(status === "authenticated") redirect("/conversation");

    const loginWithGoogle = async () => {
        const res = await signIn("google", 
        { callbackUrl: "http://localhost:3000/conversation" }
        );
        console.log(res);
    }

    const toggleVisibility = () => setIsVisible(!isVisible);
  return (
        <div className="flex justify-center items-center h-full">
             <Card className="max-w-[350px] w-[75%]">
                <CardHeader className="flex justify-center text-xl w-full ">
                    <div className="flex flex-col w-[90%]">
                        <h1 className="text-2xl font-bold">Login</h1>
                        <p className="text-sm">Login to your account</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <Button onClick={loginWithGoogle} className="flex items-center gap-2 w-[95%] mx-auto" >
                        <Image src="/assets/google.png" alt="Google" width={20} height={20} className="rounded-full bg-white" />
                        <p >
                            Login with Google
                        </p>
                    </Button>
                    <Divider className="w-[100%] mx-auto my-4"/>
                    <div className="flex flex-col gap-2 w-[95%] mx-auto">
                        <Input
                        type="email"
                        variant="bordered"
                        label="Email"
                        placeholder="Enter your email"
                        />
                            <Input
                            label="Password"
                            variant="bordered"
                            placeholder="Enter your password"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <Image className="text-2xl text-default-400 pointer-events-none" src='/assets/closed.png' />
                                ) : (
                                    <Image className="text-2xl text-default-400 pointer-events-none" src='/assets/open.png' />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
                        />
                    </div>
                </CardBody>
                <Divider/>
                <CardFooter className="flex justify-end">
                        <Button  className="w-[30%] mx-[5%]">
                            Submit
                        </Button>
                </CardFooter>
                </Card>
    </div>
  );
}
