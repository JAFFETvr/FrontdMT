import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPaw } from "react-icons/fa";

const Header = () => {
    const baseLinkClass = "transition duration-150 ease-in-out px-3 py-2 pb-[6px] text-sm font-medium border-b-2";
    const activeLinkClass = "border-orange-500 text-orange-600 font-semibold";
    const inactiveLinkClass = "border-transparent text-gray-600 hover:text-orange-600";

    return (
        <nav className="bg-white shadow-lg border-b border-gray-300 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div className="flex-shrink-0 flex items-center gap-2">
                         <FaPaw className="h-6 w-6 text-orange-500" />
                         <NavLink to="/main" className="font-bold text-lg text-gray-800 hover:text-orange-600 transition duration-150 ease-in-out">
                             Mi Hámster App
                         </NavLink>
                    </div>

                    <div className="flex items-center">
                        <ul className="flex space-x-1 sm:space-x-4">
                            <li>
                                <NavLink
                                    to="/main"
                                    className={({ isActive }) =>
                                        `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
                                    }
                                >
                                    Ambiente y Alimento
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/monitoreo"
                                    className={({ isActive }) =>
                                        `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
                                    }
                                >
                                    Vista Mascota
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Header;