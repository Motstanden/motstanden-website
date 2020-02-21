import React from "react"

import HamburgerButton from "./HamburgerButton.js"
import SideDrawer from "./SideDrawer.js"
import Backdrop from "./Backdrop.js"


class Sidebar extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            sidebarIsVisible: false
        }
    }

    hamburgerButtonClick = () => {
        this.setState({sidebarIsVisible: !this.state.sidebarIsVisible})
    }

    backdropClick = () => {
        this.setState({sidebarIsVisible: false})
    }

    render(){

        let backdrop
        let sidebarIsVisible = this.state.sidebarIsVisible

        if(sidebarIsVisible){
            backdrop = <Backdrop onClick={this.backdropClick}/>
        }

        return (
            <div>
                {backdrop}
                <HamburgerButton onClick={this.hamburgerButtonClick}/>
                <SideDrawer isVisible={sidebarIsVisible}/>
            </div>
        )
    }
}


export default Sidebar