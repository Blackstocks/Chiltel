import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import BestSeller2 from '../components/BestSeller2'
import OurPolicy from '../components/OurPolicy'
// import NewsletterBox from '../components/NewsletterBox'
import Partner from '../components/Partner'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection/>
      <BestSeller/>
      <BestSeller2/>
      <Partner/>
      <OurPolicy/>
      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Home
