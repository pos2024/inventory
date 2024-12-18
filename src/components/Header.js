import React from 'react'

const Header = () => {


  const handleLogoutButton = () => {
    localStorage.removeItem('user');
    window.location.reload();  
  };
  

  return (
    <div className='bg-white h-16 shadow-lg fixed top-0 right-0 z-50 w-10/12 flex justify-between items-center px-4'>
    <div>

    </div>
    <div>
      <button 
        className='text-black font-semibold hover:text-gray-900 mr-4'
        onClick={handleLogoutButton} 
      >
        Logout
      </button>
    
    </div>
  </div>
  )
}

export default Header