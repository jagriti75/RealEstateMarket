import React from "react";
import styles from "./About.module.css";

export const About = () => {

    return (
        <div className={styles.aboutContainer}>
            <div className={styles.overlay}></div>
            <div className={styles.title} >
                <span>ABOUT </span>
                <span>US</span>
            </div>
            <div className={styles.aboutSection}>
                <p>Welcome to MarketPlace, your premier destination for all your real estate needs. 
                With years of experience and a dedicated team of professionals , we pride ourselves 
                on delivering exceptional service and unparalleled expertise to our clients.
                At MarketPlace, we understand that buying, selling, or renting a property can be a significant decision, 
                both financially and emotionally. </p>
                <p>That's why we're committed to providing you with personalized guidance and support every step of the way.
                Our team consists of seasoned real estate agents who possess in-depth knowledge of the local market trends and regulations. 
                Whether you're looking for your dream home, seeking an investment opportunity, or aiming to sell your property for the best possible price, 
                we're here to help you achieve your goals.</p>
                <p>We believe in building long-lasting relationships with our clients based on trust, integrity, and transparency. When you choose MarketPlace, you can rest assured that you're in capable hands.
                Explore our extensive portfolio of properties, ranging from cozy apartments to luxurious estates. Whatever your preferences and requirements may be, we're dedicated to finding the perfect property that meets your needs and exceeds your expectations.
                Contact us today to embark on your real estate journey with confidence. 
                </p>
                <p>
                Let MarketPlace be your trusted partner in turning your real estate dreams into reality.
                </p>
            </div>
        </div>
    );
}