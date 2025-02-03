import React, { useState } from 'react'
import { BsChatDots } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import Avatar from '../components/avatar'
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from './SearchUser';


const SideBar = () => {

     const user = useSelector(state => state.user)
     const [editUserOpen,setEditUserOpen] = useState(false)
     const [allUser,setAllUser] = useState([])
     const [openSearchUser,setOpenSearchUser] = useState(false)

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
         <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 flex flex-col justify-between'>
                <div>
                     <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md ${isActive && 'bg-slate-200'}`} title='chat'>
                        <BsChatDots size={25} />
                     </NavLink>

                     <div onClick={()=> setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md mt-1' title='add freind'>
                        <FaUserPlus size={25} />
                     </div>
                </div>

                <div>
                    <button title={user?.name} onClick={()=>setEditUserOpen(true)}>
                         <Avatar
                              width={40}
                              height={40}
                              name={user?.name}
                              imageUrl={user?.profile_pic}
                              userId={user?._id}
                         />
                    </button>

                     <button className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md mt-1' title='logout'>
                         <span className='-ml-1'>
                               <IoMdLogOut  size={25}/>
                         </span>
                     </button>
                </div>
         </div>

         <div className='w-full'>
               <p className='text-lg font-bold flex justify-center items-center h-16'>Message</p>
               <Divider/>

               <div className='h-[calc(100vh-73px)] overflow-x-hidden overflow-y-auto scrollBar'>
                    {
                         allUser.length === 0 && (
                              <div className='mt-12'>
                                   <div className='flex justify-center items-center my-4 text-slate-400'>
                                        <GoArrowUpLeft size={50} />
                                   </div>
                                   <p className='text-sm text-center text-slate-400'>Explore user to start conversion with.</p>
                              </div>
                         )
                    }
               </div>
         </div>

         {/* Edit User Details */}
         {
               editUserOpen && (
                    <EditUserDetails onClose={()=>setEditUserOpen(false)} user={user}/>
               )
         }

         {/* Search Users */}
         {
               openSearchUser && (
                    <SearchUser onClose={()=> setOpenSearchUser(false)} />
               )
         }
    </div> 
  )
}

export default SideBar
