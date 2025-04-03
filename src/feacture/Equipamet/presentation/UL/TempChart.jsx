import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TempChart = ({ temperatureData }) => {
    if (!temperatureData || temperatureData.length === 0) {
        return <p className="text-center text-gray-500">No hay datos disponibles.</p>;
    }

    return (
        <div className="w-full p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">📊 Temperatura</h2>
            
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" stroke="#3182CE" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TempChart;
