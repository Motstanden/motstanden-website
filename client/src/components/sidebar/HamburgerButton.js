import React from "react"
import style from "./HamburgerButton.module.css"


const HamburgerButton = (props) => (
    <button className = {style.hamburgerButton} onClick={props.onClick}>
        <div className={style.hamburgerButtonLine}></div>
        <div className={style.hamburgerButtonLine}></div>
        <div className={style.hamburgerButtonLine}></div>
    </button>
)

export default HamburgerButton
