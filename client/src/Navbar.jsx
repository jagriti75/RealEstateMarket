import React from "react";
import styles from './Navbar.module.css';

import { useSelector } from "react-redux";
import profile from './assets/profile.webp';
import { NavLink ,useLocation} from "react-router-dom";

export const Navbar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    return (

        <nav className={styles.container}>
            <div className={styles.title} ><a href="/"><span className={styles.black}>Market</span><span className={styles.white}>Place.</span></a></div>
            
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