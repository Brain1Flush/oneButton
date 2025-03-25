import ReactDOM from 'react-dom'
import { Component, useEffect } from "react"
import { useState } from "react"
import './LightDarkMode.css'


const LightDarkMode = () => {
    const [toggled, setToggled] = useState(false)

    useEffect(() => {
        document.body.className = toggled ? 'light-mode' : 'dark-mode';
    }, [toggled]);

    return (
        <>
            <div className='thumb'></div>
            <label>{toggled ? 'light mode' : 'dark mode'}</label>
            <button className={`toggle-btn ${toggled ? 'toggled' : ""}`} onClick={() => setToggled(!toggled)}>
                <div className='thumb'></div>
            </button>
        </>
    )
}

export default LightDarkMode;