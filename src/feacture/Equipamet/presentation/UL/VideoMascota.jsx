const VideoMascota = () => {
    return (
        <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">🎥 Video en Vivo</h2>
            <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center">
                <span className="text-gray-500">[Aquí irá el video]</span>
            </div>
        </div>
    );
};

export default VideoMascota;
