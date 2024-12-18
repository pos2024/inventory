import React from 'react'
import SoftDrinksTable from '../components/SoftDrinksTable'
import ProductsTable from '../components/ProductsTable'
import UpdatePrice from '../components/UpdatePrice'
import ProfitMarginCalculator from '../components/ProfitMarginCalculator'

const ProductList = () => {
  return (
    <div className=' flex flex-col mt-10 h-full'>

      <ProfitMarginCalculator/>
 <ProductsTable/>
        <SoftDrinksTable/>
       
    

    </div>
  )
}

export default ProductList