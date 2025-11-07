import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'


function AppHeader() {
  return (
    <div className='flex justify-between items-center p-4 shadow w-full'>
      <SidebarTrigger/>
      <UserButton/>
    </div>
  )
}

export default AppHeader
