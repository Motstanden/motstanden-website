import React from "react"
import style from "./backdrop.module.css"


const Backdrop = (props) => (
    <div className={style.backdrop} onClick={props.onClick}></div>
)

export default Backdrop