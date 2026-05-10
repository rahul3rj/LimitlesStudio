'use client'
import Hero from './components/Hero/Hero'
import Navbar from './components/Shared/Navbar'
import Cursor from './components/Shared/Cursor'
import React, { useState } from 'react'
import OurServices from './components/Services/OurServices'
import OurWork from './components/Work/OurWork'
import Services from './components/Services/Services'
import Footer from './components/Shared/Footer'
import Loader from './components/Shared/Loader'

const Page = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className='overflow-x-hidden relative'>
            {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
            <div className='w-full'>
                <Cursor />
                <Navbar />
                <Hero />
                <OurServices />
                <Services />
                <OurWork />
                <Footer />
            </div>
        </div>
    )
}

export default Page