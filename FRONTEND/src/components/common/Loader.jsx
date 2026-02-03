const Loader = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 border-l-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        {/* Optional data or logo could go here */}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-center items-center h-full w-full min-h-[100px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600 border-l-transparent"></div>
        </div>
    );
};

export default Loader;
