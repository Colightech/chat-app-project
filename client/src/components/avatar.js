import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const Avatar = ({userId,name,imageUrl,width,height}) => {
    const onlineUser = useSelector(state=> state?.user?.onlineUser)

    // this logic is use to split the name and take the first letter of each split,
    // it is actually to abbreviate the name.
    let avatarName = ""

    if(name){
        const splitName = name?.split(" ")

        if(splitName.length > 1){
            avatarName = splitName[0][0]+splitName[1][0]
        } else {
            avatarName = splitName[0][0]
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-grey-200',
        'bg-cyan-300',
        'bg-fuchsia-400',
        'bg-violet-500',
        'bg-sky-300',
        'bg-teal-400',
        'bg-green-500',
        'bg-lime-400',
        'bg-amber-500',
        'bg-orange-500'
    ]

    const randomColor = Math.floor(Math.random() * 15)

    const isOnline = onlineUser.includes(userId)

  return (
    <div className='text-slate-800 rounded-full border relative' style={{width: width+"px", height: height+"px"}}>
        {
            imageUrl ? (
                <img 
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
            ) : (
                name ? (
                    <div style={{width: width+"px", height: height+"px"}} className={`overflow-hidden rounded-full flex justify-center items-center font-bold text-2xl ${bgColor[randomColor]}`}>
                       {avatarName}
                    </div>
                ) : (
                  <FaRegCircleUser
                     size={width}
                  />
                )
            )
        }

        {
            isOnline && (
                <div className='bg-green-500 p-1 absolute bottom-2 -right-1 z-10 rounded-full'></div>
            )
            
        }

        {
            !isOnline && (
                <div className='bg-gray-400 p-1 absolute bottom-2 -right-1 z-10 rounded-full'></div>
            )
        }

    </div>
  )
}

export default Avatar
