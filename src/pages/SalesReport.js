import React from 'react'
import Sales from '../components/Sales'
import SalesCategories from '../components/SalesCategories'
import PrintProductList from '../components/PrintProductList'


const SalesReport = () => {
  return (
    <div className=' flex flex-col mt-10 h-screen'>
        <SalesCategories/>
        <Sales/>
        <PrintProductList/>

    </div>
  )
}

export default SalesReport