import { useState, useEffect } from 'react';

const Loader = ({ fullScreen = false, waitMessage = null }) => {
    const [showSlowMessage, setShowSlowMessage] = useState(false);

    useEffect(() => {
        let timer;
        if (fullScreen && waitMessage) {
            timer = setTimeout(() => {
                setShowSlowMessage(true);
            }, 3000); // Show message after 3 seconds of loading
        }
        return () => clearTimeout(timer);
    }, [fullScreen, waitMessage]);

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-purple-500 gap-4">
                {showSlowMessage && waitMessage && (
                    <p className="text-gray-400 font-medium animate-pulse text-sm">
                        {waitMessage}
                    </p>
                )}
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
