import React from 'react'
import Hero from '../_components/Hero'
import { getCurrentDbUser } from '@/lib/getCurrentDbUser';
import { UserType } from '@/types';

async function page() {  
  return (
    <div>
      <Hero/>
    </div>
  )
}

export default page
