import React from "react"
import style from "./SideDrawer.module.css"
import {Link} from "react-router-dom"
import motstandenLogo from "../../images/motstanden_logo_lowres.png"

class SideDrawer extends React.Component {
    render() {

        let animateIntoVisibility
        if(this.props.isVisible){
            animateIntoVisibility = style.animateIntoVisibility
        }

        return(
            <div className={style.sideDrawer + " " + animateIntoVisibility}>
                <div className={style.sidebarHeader}>
                    <img src={motstandenLogo} className={style.logo} alt="Logoen til Motstanden"></img>
                    <h3 className={style.sidebarTitle}>Motstanden</h3>
                </div>
                <nav>
                    <ul className={style.navItems}>
                        <Link to="/" >
                            <li className={style.navItem}>Hjem</li>
                        </Link>
                        <Link to="/bli-medlem">
                            <li className={style.navItem}>Bli medlem</li>
                        </Link>
                        <Link to="/notearkiv">
                            <li className={style.navItem}>Notearkiv</li>
                        </Link>
                        <Link to="/studenttraller">
                            <li className={style.navItem}>Studenttraller</li>
                        </Link>
                        <Link to="/sitater">
                            <li className={style.navItem}>Sitater</li>
                        </Link>
                        <Link to="/logg-inn">
                            <li className={style.navItem}>Logg inn</li>
                        </Link>
                    </ul>
                </nav>
            </div>
        )
    }
}

export default SideDrawer
