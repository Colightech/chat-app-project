import React, { useEffect, useState } from 'react'
import { BsChatDots } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import Avatar from '../components/avatar'
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from './SearchUser';
import moment from 'moment'
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { logout } from '../redux/userSlice'


const SideBar = () => {

     const user = useSelector(state => state.user)
     const [editUserOpen,setEditUserOpen] = useState(false)
     const [allUser,setAllUser] = useState([])
     const [openSearchUser,setOpenSearchUser] = useState(false)
     const socketConnection = useSelector(state => state?.user?.socketConnection)
     const dispatch = useDispatch()
     const navigate = useNavigate()

     // To Display the User you Have Chatted with on The Sidebar
     useEffect(() => {
          if(socketConnection){
               socketConnection.emit('sidebar',user?._id)

               socketConnection.on('conversation', (data) => {

                    // To get or add additional field (userDetail) from data, i have to map through data
                    const conversationUserData = data.map((conversationUser,index) => {

                         if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                              return {
                                   ...conversationUser,
                                   userDetail : conversationUser?.sender
                              }
                         }
                         else if (conversationUser?.receiver?._id !== user?._id) {
                              return {
                                   ...conversationUser,
                                   userDetail : conversationUser?.receiver
                              }
                         }
                         else {
                              return {
                                   ...conversationUser,
                                   userDetail : conversationUser?.sender
                              }
                         }
                    })
               setAllUser(conversationUserData)
               })
          }
     },[socketConnection,user])

     const handleLogOut = () => {
          dispatch(logout())
          navigate('/checkemail')
          localStorage.clear()
     }

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

                     <button onClick={handleLogOut} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md mt-1' title='logout'>
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
                    {
                         allUser.map((con,index) => {
                              return (
                                   <NavLink to={"/"+con?.userDetail?._id} key={con._id} className='flex items-center gap-2 mb-4 cursor-pointer p-1 border-2 border-transparent hover:border-primary border-r-2'>
                                        <div>
                                             <Avatar
                                                  width={40}
                                                  height={40}
                                                  imageUrl={con?.userDetail?.profile_pic}
                                                  name={con?.userDetail?.name}
                                                  userId={user?._id}
                                             />
                                        </div>
                                        <div className='flex items-end w-full'> 
                                             <div className='flex items-end gap-1'>
                                                  <div>
                                                       {
                                                            con?.lastMsg?.imageUrl && (
                                                                <div className='flex gap-1 items-center text-xs text-slate-500'>
                                                                   <FaImage size={10} />
                                                                   {!con?.lastMsg?.text && <span>image</span>}
                                                                </div>
                                                            )
                                                       }
                                                  </div>
                                                  <div>
                                                       {
                                                            con?.lastMsg?.videoUrl && (
                                                              <div  className='flex gap-1 items-center text-xs text-slate-500'>
                                                                 <FaVideo />
                                                                 {!con?.lastMsg?.text && <span>video</span>}
                                                              </div>
                                                            )
                                                       }
                                                  </div>
                                             </div>
                                             <div>
                                                  <h3 className='text-ellipsis line-clamp-1 font-semibold'>{con?.userDetail?.name}</h3>
                                                  <p className='text-xs line-clamp-1 text-slate-500'>{con?.lastMsg?.text}</p> 
                                             </div>
                                             <p className='ml-auto w-16 text-slate-400 pl-1.5 text-xs'>{moment(con?.lastMsg?.createdAt).format('LT')}</p>
                                             {
                                                  Boolean(con.unSeenMsg) && (
                                                       <p className='bg-green-500 w-5 text-xs m-1 h-5 rounded-full flex items-center justify-center text-white font-bold'>{con.unSeenMsg}</p>
                                                  )
                                             }
                                             
                                        </div>
                                   </NavLink>
                              )
                         })
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
