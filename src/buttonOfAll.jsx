import React, { useState } from "react";
import './buttonOfAll.css'

const options = [
    { id: 1, label: "News"},
    { id: 2, label: "Weather" },
    { id: 3, label: "Calendar"},
    { id: 4, label: "Search"},
    { id: 5, label: "Notes" }
]

const ButtonOfAll = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div className="container">
            <button className="button-all" onMouseEnter={toggleExpand} onMouseLeave={toggleExpand}>
                This is a button
            </button>

            {options.map((option, index) => (
                <div
                    key={option.id}
                    className={`web-node ${isExpanded ? "show" : ""}`}
                    style={{
                        transform: `rotate(${(360 / options.length) * index}deg) translate(150px) rotate(-${(360 / options.length) * index}deg)`,
                    }}
                >
                    {option.label}
                </div>
            ))}
        </div>

        // <div className="buttonOfAll">This is a button</div>
    )
}

export default ButtonOfAll;