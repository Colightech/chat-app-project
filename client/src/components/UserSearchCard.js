import React from 'react'
import Avatar from './avatar'
import { Link } from 'react-router-dom'

const UserSearchCard = ({onClose,user}) => {
  return (
    <Link to={"/"+user._id} onClick={onClose} className='flex gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:bg-primary hover:text-white rounded-md cursor-pointer'>
        <div>
            <Avatar 
                width={50}
                height={50}
                name={user?.name}
                userId={user?._id}
            />
        </div>
        <div>
            <div className='font-bold text-ellipsis line-clamp-1'>
                {user?.name}
            </div>
            <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
        </div>
    </Link>
  )
}

export default UserSearchCard
