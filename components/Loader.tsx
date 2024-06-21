import Image from 'next/image'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-screen w-full flex justify-center items-center animate-pulse duration-700'>
      <Image src='/only_logo.svg' alt='MICO WHITEBOARD LOGO' width={100} height={50}  />
    </div>
  )
}

export default Loader
