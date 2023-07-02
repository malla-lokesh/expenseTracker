import React, { useState } from "react";

const Tooltip = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && <div 
                className="absolute bg-red-900 py-0.5 px-1 text-sm text-white rounded"
                style={{ bottom: '-1.75rem', left: '50%', transform: 'translateX(-50%)' }}
                onMouseEnter={() =>setIsVisible(false)}
            >{text}</div>}
        </div>
    )
}

export default Tooltip;