import React from 'react'
import AddProduct from '../components/AddProduct'
import AddCategoryAndSubcategory from '../components/AddCategoryAndSubcategory'
import UpdateProduct from '../components/ProductUpdateForm '
import UpdatePrice from '../components/UpdatePrice'

const AddProdCate = () => {
  return (
    <div className=' mt-16 flex flex-col   p-5 space-x-5 bg-gray-200 w-full h-screen'>
     
        <AddProduct/>
        <AddCategoryAndSubcategory/>
        <UpdatePrice/>
    
    </div>
  )
}

export default AddProdCate