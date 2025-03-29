const TempChart = ({ temperatureData }) => {
    if (!temperatureData || temperatureData.length === 0) return <p className="text-center text-gray-500">No hay datos disponibles.</p>;

    const maxTemp = Math.max(...temperatureData.map((data) => data.temp));

    return (
        <div className="w-full p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">📊 Temperatura</h2>
            
            <div className="flex items-end justify-between h-40 border-b border-gray-300 pb-2 space-x-2">
                {temperatureData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center w-10 sm:w-14">
                        {/* Barra de temperatura */}
                        <div
                            className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 ease-in-out"
                            style={{
                                height: `${(data.temp / maxTemp) * 100}%` || "10%",
                                minHeight: "10px"
                            }}
                        ></div>
                        {/* Etiqueta de temperatura */}
                        <span className="text-xs mt-1">{data.temp}°C</span>
                    </div>
                ))}
            </div>

            {/* Etiquetas de tiempo */}
            <div className="flex justify-between mt-2 text-xs text-gray-600">
                {temperatureData.map((data, index) => (
                    <span key={index} className="text-center w-10 sm:w-14">{data.time}</span>
                ))}
            </div>
        </div>
    );
};

export default TempChart;
