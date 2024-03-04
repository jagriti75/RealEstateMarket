import React from "react";
import styles from './Navbar.module.css';
import search from './assets/search.png';

export const Navbar = () => {
    return(
   
            <nav className={styles.container}>
                <div>Holiday Planner</div>
                <div className={styles.search}>
                        <input type="text" placeholder="Search ..."/>
                        <button><img src={search} alt="?"/></button>
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
                        <a href="/signup">sign up</a>
                    </li>
                </ul>
                </div>
            </nav>
      
    )
}