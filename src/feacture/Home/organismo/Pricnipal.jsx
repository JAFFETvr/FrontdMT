import React from 'react';
import { useNavigate } from 'react-router-dom';

function PrincipalPgina() {
  const navigate = useNavigate();

  const handleIngresarClick = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="relative flex flex-grow items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-200 to-red-200 p-4 md:p-8 overflow-hidden">

        <div className="absolute top-[-10%] left-[-15%] w-72 h-72 md:w-96 md:h-96 bg-yellow-200 rounded-full opacity-30 blur-3xl z-0 animate-pulse-slow"></div>
        <div className="absolute bottom-[-15%] right-[-20%] w-80 h-80 md:w-[450px] md:h-[450px] bg-red-300 rounded-full opacity-25 blur-3xl z-0 animate-pulse-medium"></div>
        <div className="absolute top-[15%] right-[10%] w-24 h-24 md:w-32 md:h-32 bg-orange-300 rounded-full opacity-40 blur-2xl z-0 animate-pulse-fast"></div>
        <div className="absolute bottom-[20%] left-[5%] w-20 h-32 md:w-28 md:h-40 bg-yellow-300 rounded-[50%] opacity-30 blur-2xl z-0 animate-pulse-medium"></div>
        <div className="absolute top-[60%] left-[-5%] w-80 h-4 md:w-96 md:h-6 bg-orange-200 rounded-full opacity-20 blur-xl z-0 transform -rotate-12 animate-pulse-slow"></div>

        <span className="absolute top-[10%] left-[8%] text-5xl md:text-6xl text-yellow-400/30 transform -rotate-12 z-5 opacity-80 blur-[1px] hidden md:block animate-drift-slow">
          🐾
        </span>
        <span className="absolute bottom-[8%] right-[5%] text-4xl md:text-5xl text-red-400/30 transform rotate-15 z-5 opacity-70 blur-[1px] hidden md:block animate-drift-medium">
          🌰
        </span>
        <span className="absolute bottom-[45%] left-[15%] text-3xl md:text-4xl text-orange-400/30 transform rotate-6 z-5 opacity-60 blur-[1px] hidden lg:block animate-drift-fast">
          🌿
        </span>
        <span className="absolute top-[30%] right-[25%] text-4xl md:text-5xl text-yellow-500/20 transform -rotate-6 z-5 opacity-50 blur-[2px] hidden lg:block animate-drift-slow">
          ☀️
        </span>
        <span className="absolute top-[75%] right-[15%] text-3xl md:text-4xl text-red-300/25 transform rotate-[-8deg] z-5 opacity-60 blur-[1.5px] hidden lg:block animate-drift-medium">
          ✨
        </span>

         <p className="absolute bottom-4 right-4 text-xs text-orange-900/30 z-5 hidden md:block transform rotate-[-2deg]">
            Cuidado & Amor para tu Roedor
        </p>


        <div
          className="group relative w-full max-w-6xl transition duration-300 ease-in-out hover:scale-[1.01] hover:shadow-2xl rounded-2xl p-1 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 z-10 animate-fade-in-up"
        >
          <div className="relative flex flex-col md:flex-row items-center w-full bg-white/85 backdrop-blur-md rounded-xl shadow-lg overflow-visible min-h-[320px] md:min-h-[300px]">

            <div className="relative md:absolute w-full md:w-auto pt-8 md:pt-0 md:left-0 md:top-1/2 md:transform md:-translate-x-[25%] md:-translate-y-1/2 z-20 transition duration-300 ease-in-out group-hover:scale-105 flex justify-center md:justify-start">
              <img
                src="/h.png"
                alt="Hámster"
                className="w-40 h-auto md:w-64 lg:w-72 md:h-auto object-contain drop-shadow-lg"
              />
            </div>

            <div className="flex-grow py-6 px-6 md:py-10 md:pr-10 md:pl-64 lg:pl-80 text-center md:text-left w-full">
        

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center md:justify-start gap-2">
                <span>¡Bienvenido al Mundo Hámster!</span>
              </h1>

              <hr className="w-1/3 md:w-1/4 my-4 lg:my-5 border-t-2 border-orange-200 mx-auto md:mx-0" />

              <p className="text-gray-700 mb-8 lg:mb-10 text-base md:text-lg leading-relaxed">
                Descubre todo sobre estos adorables roedores. Aprende sobre sus cuidados,
                alimentación, hábitats y cómo hacerlos felices. ¡Prepárate para
                gestionar la vida de tu pequeño amigo!
              </p>

              <button
                onClick={handleIngresarClick}
                className="bg-orange-500 text-white px-8 py-3 lg:px-10 lg:py-3.5 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-300 font-medium text-lg shadow-md hover:shadow-lg"
                // Botón ligeramente más grande
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrincipalPgina;
