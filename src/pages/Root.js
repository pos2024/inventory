import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Header from "../components/Header";

const Root = () => {
  return (
    <div className="flex flex-col h-full"> <MainNavigation />
    
    
       
        <div className="ml-72 flex-grow p-4">  
          <Header /> 
          <Outlet />
        </div>
    
    </div>
  );
};

export default Root;
