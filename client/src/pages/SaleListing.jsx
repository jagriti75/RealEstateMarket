import React from 'react';
import { useState,useEffect } from 'react';
import styles from './SaleListing.module.css';
import { Link } from 'react-router-dom';
import rupee from "../assets/rupee-indian.png";

export const SaleListing = () =>{
    const [listings, setListings] = useState([]);
    const [sale , setSale] = useState([]);

    useEffect(() => {

        const fetchListings = async () => {
            const res = await fetch('/api/listing/get/listings/all',
                {
                    method: 'GET',
                });

            const data = await res.json();

            if (data.success === false) {
                return;
            }

            const sale = [];

           data.forEach((element)=>{
            if(element.type == 'sale'){
                sale.push(element);
            }
           })

           setSale(sale);
         
            setListings(data);

        }

        fetchListings();

    }, []);

    return(
        <div className={styles.saleContainer}>
            <h1 className={styles.title}>Sale</h1>
            <div className={styles.box}>
            {listings &&  sale.map((listing) =>(
                <div key={listing._id} >
                    { (
                        <div className={styles.listingBox}>
                        <img src={listing.imageUrls[0]} />
                        <Link className={styles.heading} to={`/listing/${listing._id}`}>
                            <p >{listing.name}</p>
                        </Link>
                        <span>{listing.offer ?
                                (<div>
                                    <span className={styles.rupee}><img src={rupee} /></span>
                                    <span className={styles.cut}>{listing.regularPrice}</span>
                                    <span className={styles.rupee}><img src={rupee} /></span>
                                    <span>{listing.discountPrice}</span>
                                </div>)
                                : (<div> <span className={styles.rupee}><img src={rupee} /></span>
                                    <span>
                                        {listing.regularPrice}
                                    </span>                                
                                </div>)
                            }
                            </span>
                    </div>
                    )}
                </div>
            ))}
        </div>
        </div>

    )
}