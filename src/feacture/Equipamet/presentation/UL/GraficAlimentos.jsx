import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const GraficaAlimento = () => {
    // Datos para la gráfica de alimento
    const data = [
        { name: "Alimento Restante", value: 6 }, // Cantidad de comida en KG
        { name: "Consumido", value: 4 }
    ];

    // Colores para cada parte de la gráfica
    const COLORS = ["#38A169", "#E53E3E"]; // Verde para lo restante, rojo para lo consumido

    return (
        <div className="w-full p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">🍽️ Consumo de Alimento</h2>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficaAlimento;
