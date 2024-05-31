import React from 'react';
import styles from './ListingItem.module.css';
import { Link } from 'react-router-dom';
import point from '../src/assets/placeholder.png'
import { Icon } from 'react-icons-kit';
import { bathtub } from 'react-icons-kit/fa/bathtub';
import { bed } from 'react-icons-kit/fa/bed';


export const ListingItem = ({ listing }) => {


    return (
        <div className={styles.listingBox}>
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={
                        listing.imageUrls[0] ||
                        'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
                    }
                    alt='listing cover'
                    className={styles.images}
                />
                <div className={styles.description}>
                    <p className={styles.heading}>
                        {listing.name}
                    </p>
                    <div className={styles.addressBox}>
                        <p className={styles.address}>
                         <span><img src={point}/>
                         </span><span>{listing.address}</span>
                        </p>
                    </div>
                    <p className={styles.desc}>
                        {listing.description}
                    </p>
                    <p className={styles.price}>
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR'
                            })
                            : listing.regularPrice.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR'
                            })}
                        {listing.type === 'rent' && (<span className={styles.month}>/month</span>)}
                    </p>
                    <div className={styles.houseInfo}>
                                <div className={styles.room}>
                                    <Icon icon={bed}/>
                                    {listing.bedrooms > 1
                                        ? `${listing.bedrooms} beds `
                                        : `${listing.bedrooms} bed `}
                                </div>
                                <div className={styles.room}>
                                    <Icon icon={bathtub}/>
                                    {listing.bathrooms > 1
                                        ? `${listing.bathrooms} baths `
                                        : `${listing.bathrooms} bath `}
                                </div>
                            </div>
                </div>
            </Link>
        </div>
    );
}