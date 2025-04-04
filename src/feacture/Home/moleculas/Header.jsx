import React from "react";
import { FaPaw } from "react-icons/fa";
function Header() {
  return (
    <div className="header">
        <FaPaw className="h-6 w-6 text-orange-500" />
        <h1 className="font-bold text-lg text-gray-800 hover:text-orange-600 transition duration-150 ease-in-out"/>
            Mi Hámster App
      
      <div>
        <h1 className="">Iniciar secion</h1>
      </div>
    </div>
  );
}

export default Header;