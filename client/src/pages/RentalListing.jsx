import React from 'react';
import { useState,useEffect } from 'react';
import styles from './RentalListing.module.css';
import { Link } from 'react-router-dom';
import rupee from "../assets/rupee-indian.png";

export const RentalListing = () =>{
    const [listings, setListings] = useState([]);

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
        
            setListings(data);

        }

        fetchListings();

    }, []);

    return(
        <div className={styles.rentContainer}>
            <h1 className={styles.title}>Rentals</h1>
            <div className={styles.box}>
            {listings &&  listings.map((listing) =>(
                <div key={listing._id}>
                    {listing.type=='rent' && (
                    <div  className={styles.listingBox}>
                         <img src={listing.imageUrls[0]} />
                         <Link className={styles.heading} to={`/listing/${listing._id}`}>
                            <p  >{listing.name}</p>
                         </Link>
                         <span>{listing.offer ?
                                (<div>
                                    <span className={styles.rupee}><img src={rupee} /></span>
                                    <span className={styles.cut}>{listing.regularPrice}</span>
                                    <span className={styles.rupee}><img src={rupee} /></span>
                                    <span>{listing.discountPrice}</span>
                                    <span className={styles.grey}> /month</span>
                                </div>)
                                : (<div> <span className={styles.rupee}><img src={rupee} /></span>
                                    <span>
                                        {listing.regularPrice}
                                    </span>
                                    <span>{listing.offer == false && <span className={styles.grey}> /month</span>}</span>
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