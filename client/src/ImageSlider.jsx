import React, { useState } from 'react';
import styles from "./ImageSlider.module.css";
import arrow from "../src/assets/right-arrow.png";

const ImageSlider = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className={styles.imageSlider}>
            <button className={styles.leftarrow} onClick={prevImage}>
                <img src={arrow} />
            </button>
            <img className={styles.images} src={images[currentImageIndex]} alt={`Slide ${currentImageIndex}`} />
            <button className={styles.rightarrow} onClick={nextImage}>
                 <img src={arrow} />
            </button>
        </div>
    );
};

export default ImageSlider;
