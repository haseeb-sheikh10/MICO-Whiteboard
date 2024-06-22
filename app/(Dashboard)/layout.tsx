import React from 'react'
import Navbar from './_components/Navbar'
import MainSidebar from './_components/main-sidebar/MainSidebar'
import OrgSidebar from './_components/org-sidebar/OrgSidebar'

const layout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <main className='h-full flex'>
      <MainSidebar />
      <section className='h-full w-full'>
        <div className='flex gap-x-3 h-full'>
          <OrgSidebar />
          <div className='flex-1 h-full'>
            <Navbar />
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}

export default layout
