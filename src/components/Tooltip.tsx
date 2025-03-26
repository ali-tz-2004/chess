import { useState } from "react";

interface TooltipType{
    children: React.ReactNode;
    messageTooltip: string;
}

export const Tooltip = ({children, messageTooltip }:TooltipType) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div>
            <div className="relative">
                <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {children}
                </button>

                {isHovered && (
                    <div className="absolute z-10 mt-1 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg">
                        {messageTooltip}
                        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

