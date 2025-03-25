import { useState } from 'react'
import './App.css'
import ButtonOfAll from './ButtonOfAll'
import LightDarkMode from "./LightDarkMode.jsx";

function App() {

  return (
    <>
      <div className='lightDark'><LightDarkMode /></div>
      <ButtonOfAll />
    </>
  )
}

export default App
