import React from 'react'
import { Avatar } from '@nextui-org/react'


type UserPromptProps = {
  message: string
}

function UserPrompt(props: UserPromptProps) {
  return (
    <div className='w-full flex p-3'>
      <div className='flex md:w-full w-full justify-end gap-3'>
        <div className='min-h-[20px] border-[5px] rounded-2xl md:max-w-[75%] max-w-full bg-slate-200 '>
            <p className='p-2 text-black'>       
              {props.message}
            </p>
        </div>
        <Avatar
            isBordered
            className="transition-transform items-center justify-center"
            color="secondary"
            name="Jason Hughes"
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
      </div>
    </div>
  )
}

export default UserPrompt