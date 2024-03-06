import React from "react";
import styles from './Navbar.module.css';
import search from './assets/search.png';
import { useSelector } from "react-redux";
import  calendar from './assets/calendar.png'

export const Navbar = () => {
    const {currentUser} = useSelector((state) => state.user);
    return(
   
            <nav className={styles.container}>
                <div className={styles.title}><span><img src={calendar}/></span>Holiday Planner</div>
                <div className={styles.search}>
                        <input type="text" placeholder="Search ..."/>
                        <button type="button"><img src={search} alt="?"/></button>
                </div>
                <div>
                <ul className={styles.menu}>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/about">about</a>
                    </li>
                    <li>
                        <a className={styles.circle} href={currentUser ? "/profile" : "/signin"}>{currentUser ? (<img className={styles.profile} src={currentUser.avatar}/>) : "sign in"}</a>
                    </li>
                </ul>
                </div>
            </nav>
      
    )
}