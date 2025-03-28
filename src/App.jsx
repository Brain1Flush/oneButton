import { useState } from 'react'
import './App.css'
import ButtonOfAll from './buttonOfAll'
import LightDarkMode from "./LightDarkMode.jsx";

function App() {

  return (
    <>
      <div className='lightDark'><LightDarkMode /></div>
      <ButtonOfAll />
      <footer>Created by<a href='https://linkedin.com/in/bradley-broekman-5a63702a2' target='_blank'> <strong>@Bradley Broekman</strong></a></footer>
    </>
  )
}

export default App
