import React from "react"
import axios from "axios"
import styles from "./LoadingButton.module.css"
import ClipLoader from "react-spinners/ClipLoader"

class LoadingButton extends React.Component {
    
    render() {
        let buttonStyle = styles.buttonStyle
        if(!this.props.isLoading){
            buttonStyle += " " + styles.buttonHoverStyle
        }
        return (
            <li className={styles.grid}>
                <button 
                    onClick = { (e) => this.props.onClick(this)}
                    className = {styles.buttonStyle}
                    className = {buttonStyle}
                    disabled={this.props.isLoading}>
                   {this.props.text}
                </button>
                <ClipLoader
                    loading={this.props.isLoading}
                    color={"#18912c"}
                    size={40}
                    className={styles.loadingIconStyle}
                />
        </li>
        )
    }
}

export default LoadingButton