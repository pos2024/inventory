import React from 'react'
import AddProduct from '../components/AddProduct'
import AddCategoryAndSubcategory from '../components/AddCategoryAndSubcategory'
import UpdateProduct from '../components/ProductUpdateForm '
import UpdatePrice from '../components/UpdatePrice'
import DeliverDrinks from '../components/DeliverDrinks'
import ProfitMarginCalculator from '../components/ProfitMarginCalculator'

const AddProdCate = () => {
  return (
    <div className=' mt-16 flex flex-col space-y-5   p-5 space-x-5 bg-gray-200 w-full h-full'>
      <div>
        <ProfitMarginCalculator />
      </div>
      <div>
        <UpdatePrice />
      </div>


      <div className='flex bg-gray-800 h-auto p-6'><AddProduct />
        <AddCategoryAndSubcategory /></div>


    </div>
  )
}

export default AddProdCate