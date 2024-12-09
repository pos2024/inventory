import React from 'react'
import SoftDrinksTable from '../components/SoftDrinksTable'
import ProductsTable from '../components/ProductsTable'
import UpdatePrice from '../components/UpdatePrice'

const ProductList = () => {
  return (
    <div className=' flex flex-col mt-10 h-full'>

        <SoftDrinksTable/>
        <ProductsTable/>
    

    </div>
  )
}

export default ProductList