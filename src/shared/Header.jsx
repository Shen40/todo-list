import { NavLink } from "react-router"
import styles from "./Header.module.css";

function Header({title}){
    return <header>
        <h1 className={styles.title}>{title}</h1>
        <nav className={styles.nav}>
            <NavLink 
            to={"/"} 
            className={({isActive}) =>{
                if (isActive) return styles.active;
                return styles.inactive; 
            }}>
            Home
            </NavLink>
            <NavLink to={"/about"}
            className={({isActive}) =>{
                if (isActive) return styles.active;
                return styles.inactive; 
            }}>
            About
            </NavLink>
        </nav>
    </header>
}

export default Header;