import React, { useState } from 'react';
import styles from "./ImageSlider.module.css";



const ImageSlider = ({ images }) => {
    const imagesLength = images.length;
    return (
        <div>
            <div className={styles.imageContainer} style={{ display: 'flex', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <div key={index} style={{ margin: '10px', border: '1px solid #ccc' }}>
                      <a href={image}><img src={image} title={`Image ${index+1}/${imagesLength}`} alt={`image ${index}`} style={{height:'400px' ,width:'900px',scrollSnapAlign:'start'}}  /></a>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default ImageSlider;
