import ReactDOM from 'react-dom';
import {Component} from "react";
import {useState} from "react";
import './LightDarkMode.css'


const LightDarkMode = () => {
    const [toggled, setToggled] = useState(false);
    return (
        <>
            {/*<label>dark mode</label>*/}
            <button className={`toggle-btn ${toggled ? 'toggled' : ""}`} onClick={() => setToggled(!toggled)}>
                <div className='thumb'></div>
            </button>
        </>
    )
}

export default LightDarkMode;