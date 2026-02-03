const Loader = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 text-purple-500">
                <div className="loader"></div>
            </div>
        );
    }
    return (
        <div className="flex justify-center items-center h-full w-full min-h-[100px] text-purple-500">
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
