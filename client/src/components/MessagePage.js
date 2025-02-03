import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { MdAttachFile } from "react-icons/md";
import { FaImages } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import uploadFile from '../helper/uploadFile';

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
  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  const [message,setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : ""
  })

  const handleOpenImageVideo = () => {
    setOpenImageVideoUpload(prev => !prev)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setMessage( prev => {
      return {
        ...prev,
        imageUrl : uploadPhoto.url
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]

    const uploadVideo = await uploadFile(file)

    setMessage( prev => {
      return {
        ...prev,
        videoUrl : uploadVideo.url
      }
    })
  }

  useEffect(()=>{
    if(socketConnection) {
      socketConnection.emit('message-page',params.userId)

      socketConnection.on('message-page',(data)=>{
        console.log('user detail', data)
        setDataUser(data)
      })
    }
  },[socketConnection,params?.userId,user])

  return (
    <div>
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
            <section className='h-[calc(100vh-120px)] overflow-x-hidden overflow-y-scroll scrollBar'>
              {/* Display sent image */}
              {
                message.imageUrl && (
                  <div className='w-full h-full bg-slate-500 bg-opacity-30 flex justify-center items-center'>
                  <div className='bg-white p-1 rounded'>
                     <img 
                      src={message.imageUrl}
                      width={300}
                      height={300}
                      alt='uploadImage'
                     />
                  </div>
                  </div>
                )
              }
                Show all messages
            </section>

            {/* Send Message */}
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
            </section>
        </div>
    </div>
  )
}

export default MessagePage
