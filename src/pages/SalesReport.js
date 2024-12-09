import React from 'react'
import Sales from '../components/Sales'
import SalesCategories from '../components/SalesCategories'


const SalesReport = () => {
  return (
    <div className=' flex flex-col mt-10 h-screen'>
        <SalesCategories/>
        <Sales/>

    </div>
  )
}

export default SalesReport