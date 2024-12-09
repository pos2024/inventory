import { Outlet } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Header from "../components/Header";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex bg-gray-200">
        <MainNavigation />
        <div className="ml-64 flex-grow p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;
