import React from "react";
import styles from './Navbar.module.css';
import search from './assets/search.png';
import { useSelector } from "react-redux";
import profile from './assets/profile.webp';
import { NavLink ,useLocation} from "react-router-dom";

export const Navbar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    return (

        <nav className={styles.container}>
            <div className={styles.title} ><span className={styles.black}>Market</span><span className={styles.white}>Place.</span></div>
            <div className={styles.search}>
                <input type="text" placeholder="Search ..." />
                <button type="button"><img src={search} alt="?" /></button>
            </div>
            <div className={styles.menuSection}>
                <ul className={styles.menu}>
                    <li><NavLink to="/" className={location.pathname === '/' ? styles.active : ''}>Home</NavLink></li>
                    <li><NavLink to="/about" className={location.pathname === '/about' ? styles.active : ''}>About</NavLink></li>
                    <li>
                        <a className={styles.circle} href={currentUser ? "/profile" : "/signin"}>
                            {currentUser ? (<img className={styles.profile} src={currentUser.avatar || profile} />) : "sign in"}
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

    )
}