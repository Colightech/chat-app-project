import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { MdAttachFile } from "react-icons/md";
import { FaImages } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import uploadFile from '../helper/uploadFile';
import { MdOutlineClose } from "react-icons/md";
import Loading from './Loading';
import background_image from '../assets/wallapaper.jpeg'
import { IoSendSharp } from "react-icons/io5";
import moment from 'moment'

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)


  const [dataUser,setDataUser] = useState({
    name : "",
    email : "",
    profile_pic : "",
    online : false,
    _id : ""
  })

  const [message,setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : ""
  })
  const [allMessage,setAllMessage] = useState([])
  const [loading,setLoading] = useState(false)
  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  const currentMessage = useRef(null)

  useEffect(()=> {
     if(currentMessage.current) {
      currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
     }
  },[allMessage])

  const handleOpenImageVideo = () => {
    setOpenImageVideoUpload(prev => !prev)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage( prev => {
      return {
        ...prev,
        imageUrl : uploadPhoto.url
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage( prev => {
      return {
        ...prev,
        imageUrl : ""
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadVideo = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage( prev => {
      return {
        ...prev,
        videoUrl : uploadVideo.url
      }
    })
  }

  const handleClearUploadVideo = () => {
    setMessage( prev => {
      return {
        ...prev,
        videoUrl : ""
      }
    })
  }

  useEffect(()=>{
    if(socketConnection) {
      socketConnection.emit('message-page',params.userId)

      socketConnection.emit('seen',params.userId)

      socketConnection.on('message-page',(data)=>{
        setDataUser(data)
      })
      socketConnection.on('message',(data) => {
        setAllMessage(data)
      })
    }
  },[socketConnection,params?.userId,user])

 

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setMessage(prev => {
      return {
        ...prev,
        text : value
      }
    })
  }
  

  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if(message.text || message.imageUrl || message.videoUrl) {
      if(socketConnection) {
        socketConnection.emit('new-message',{
          sender : user?._id,
          receiver : params?.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id
        })
        // To Clear All Field After Sending
        setMessage({
          text : "",
          imageUrl : "",
          videoUrl : ""
        })
      }
    }
  }

  return (
    <div style={{ backgroundImage: `url(${background_image})`}} className='bg-no-repeat bg-cover'>
        <header className='sticky top-0 h-16 flex justify-between items-center pr-3 bg-white'>
          <div className='flex items-center gap-3'>
              <Link to={'/'} className='lg:hidden'>
                <FaAngleLeft />
              </Link>
              <div className='p-1.5 cursor-pointer'>
                 <Avatar 
                    width={50}
                    height={50}
                    imageUrl={dataUser?.profile_pic}
                    name={dataUser?.name}
                    userId={dataUser?._id}
                 />
              </div>
              <div>
                  <p className='font-semibold text-2xl'>{dataUser?.name}</p>
                  <p className='-my-2'>
                      {
                        dataUser?.online ? <span className='text-green-400 text-sm'>online</span> : <span className='text-slate-300 text-sm'>offline</span>
                      }
                  </p>
              </div>
          </div>

          <div>
            <button>
              <HiDotsVertical />
            </button>
          </div>
        </header>

        {/* Display All Message */}
        <div>
            <section className='h-[calc(100vh-120px)] overflow-x-hidden overflow-y-scroll scrollBar relative bg-slate-200 bg-opacity-40'>

              {/* Show all messages */}
              <div className='flex flex-col'  ref={currentMessage}>
                  {
                    allMessage.map((msg,index) => {
                      return (
                        <div className={` m-2 p-1 w-fit rounded max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto  bg-green-300" : "bg-white"}`}>
                          {/* Chat Image */}
                           <div>
                             {
                               msg?.imageUrl && (
                                  <img
                                     src={msg.imageUrl}
                                     className='w-full h-full object-scale-down' 
                                  />
                                )
                              }
                           </div>

                           {/* Chat Video */}
                           <div>
                             {
                               msg?.videoUrl && (
                                  <video
                                     src={msg.videoUrl}
                                     className='w-full h-full object-scale-down'
                                     controls
                                     muted
                                     autoPlay 
                                  />
                                )
                              }
                           </div>

                           {/* Chat Text */}
                           <div className='flex gap-3 items-end'>
                              <p className='w-fit'>{msg.text}</p>
                              <p className='ml-auto w-16 text-slate-400 pl-1.5 text-xs'>{moment(msg.createdAt).format('LT')}</p>
                           </div>
                        </div>
                      )
                    })
                  }
              </div>


              {/* Loading */}
              {
                loading && (
                  <div className='flex justify-center sticky bottom-0 items-center w-full h-full'>
                       <Loading />
                  </div>
                )
              }

              {/* Display sent image */}
              {
                message.imageUrl && (
                  <div className='w-full h-full sticky bottom-0 bg-slate-500 bg-opacity-30 absolute  flex justify-center items-center  '>
                    <div onClick={handleClearUploadImage} className='w-fit p-2 absolute top-2 right-2 hover:text-white cursor-pointer'>
                        <MdOutlineClose size={25} />
                    </div>
                    <div className='bg-white p-1 rounded'>
                      <img 
                        src={message.imageUrl}
                        alt='uploadImage'
                        className='aspect-square w-full h-full max-w-sm'
                      />
                    </div>
                  </div>
                )
              }

              {/* Display sent Video */}
              {
                message.videoUrl && (
                  <div className='w-full h-full sticky bottom-0 bg-slate-500 bg-opacity-30 flex justify-center items-center'>
                    <div onClick={handleClearUploadVideo} className='w-fit p-2 absolute top-2 right-2 hover:text-white cursor-pointer'>
                        <MdOutlineClose size={25} />
                    </div>
                    <div className='bg-white p-1 rounded'>
                      <video
                        src={message.videoUrl}
                        controls
                        muted
                        autoPlay
                        className='aspect-video w-full h-full max-w-sm m-1'
                      />
                    </div>
                  </div>
                )
              }
            </section>

            {/* Send Message Input */}
            <section className='h-14 bg-white flex items-center p-4'>
                <div className='relative'>
                    <button onClick={handleOpenImageVideo} className='flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white'>
                      < MdAttachFile size={25} />
                    </button>
                      
                    {/* Video and Image */}
                    {
                      openImageVideoUpload && (
                        <div className='bg-white absolute shadow rounded bottom-12 w-30 p-2 -ml-2.5 mb-1'>
                          <form>
                              <label htmlFor='uploadImage' className='flex items-center p-1 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                                <div className='text-primary'>
                                  <FaImages />
                                </div>
                                <p>image</p>
                              </label>
                              <label htmlFor='uploadVideo' className='flex items-center p-1 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                                <div className='text-purple-500'>
                                  <IoIosVideocam />
                                </div>
                                <p>video</p>
                              </label>
                            
                              <input 
                                type='file'
                                id='uploadImage'
                                onChange={handleUploadImage}
                                className='hidden'
                              />

                              <input 
                                type='file'
                                id='uploadVideo'
                                onChange={handleUploadVideo}
                                className='hidden'
                              />
                          </form>
                        </div>
                      )
                    }
                </div>
                {/* Send Message Input Box */}
                <form className='w-full  flex gap-3' onSubmit={handleSendMessage}>
                    <input
                        type='text'
                        placeholder='Message here...'
                        value={message.text}
                        name='text'
                        onChange={handleOnChange}
                        className='py-2 px-4 w-full h-full outline-none'
                    />
                    <div className='w-15 h-15'>
                      <button className='bg-primary w-10 h-10 rounded-full flex justify-center items-center text-white'>
                        <IoSendSharp size={20} />
                      </button>
                    </div>

                </form>
            </section>
        </div>
    </div>
  )
}

export default MessagePage
