import React, { useEffect, useState } from "react";
import styles from "./Listing.module.css";
import { useParams } from "react-router-dom";
import loadingimg from "../assets/loading.png";
import ImageSlider from "../ImageSlider";
import email from "../assets/email.png";
import { useSelector } from "react-redux";
import { Contact } from "../Contact";
import point from "../assets/placeholder.png";
import { Icon } from 'react-icons-kit';
import { bathtub } from 'react-icons-kit/fa/bathtub';
import { bed } from 'react-icons-kit/fa/bed';
import {car} from 'react-icons-kit/fa/car';
import {ic_taxi_alert} from 'react-icons-kit/md/ic_taxi_alert';
import {ic_no_luggage} from 'react-icons-kit/md/ic_no_luggage';
import {ic_countertops} from 'react-icons-kit/md/ic_countertops'


export const Listing = () => {

    const params = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    const [discPerc, setDiscPerc] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    const [contact, setContact] = useState(false);

    useEffect(() => {
        try {
            setLoading(true);
            const fetchListing = async () => {
                const listingId = params.listingId;
                const res = await fetch(`/api/listing/get/${listingId}`);
                const list = await res.json();
                if (list.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setLoading(false);
                setListing(list);
                setImageArray(list.imageUrls);

                const discPerc = Math.round(((listing.regularPrice - listing.discountPrice) / listing.regularPrice) * 100);
                console.log(discPerc);
                setDiscPerc(discPerc);
            }
            fetchListing();

        } catch (error) {
            setError(true);
            setLoading(false);
        }
    }, [params.listingId]);



    return (
        <div className={styles.listing}>
            <div className={styles.content}>
                {loading && (<img className={styles.loadingimg} src={loadingimg} alt="?" />)}
                {error && (<p>Something went wrong!</p>)}
                {listing && !error && !loading && (
                    <div className={styles.listingBox}>
                        <div>
                            <ImageSlider images={imageArray} />
                        </div>
                    </div>
                )}
                <div>

                    {listing && (<div className={styles.desc}>
                        <div className={styles.information}>
                            <div>
                                <div className={styles.infoBox}>
                                    <div className={styles.titleBox}>
                                        <p className={styles.name}>{listing.name}</p>
                                        <div className={styles.addressBox}>
                                            <p className={styles.address}>
                                                <span><img src={point} />
                                                </span><span>{listing.address}</span>
                                            </p>
                                        </div>
                                        <p className={styles.price}>
                                            {(listing.offer ? listing.discountPrice : listing.regularPrice)?.toLocaleString('en-IN', {
                                                style: 'currency',
                                                currency: 'INR'
                                            })}
                                            {listing.type === 'rent' && (<span
                                                style={{ fontSize: '10px', color: '#B0B0B0' }}
                                            >/month
                                            </span>)}
                                        </p>
                                        <p className={styles.cutPrice}>
                                            {listing.offer && listing.regularPrice?.toLocaleString('en-IN', {
                                                style: 'currency',
                                                currency: 'INR'
                                            })}
                                        </p>
                                        <p className={styles.discount}>
                                            {(listing.offer && `${discPerc} % off`)}
                                        </p>

                                        <div>
                                            {currentUser && currentUser._id !== listing.userRef || currentUser == null &&
                                                !contact &&

                                                (<button onClick={() => setContact(true)} className={styles.contact}>
                                                    <img src={email} style={{ height: '20px', width: '20px' }} />
                                                </button>)}
                                            {contact && <Contact listing={listing} />}
                                        </div>
                                    </div>
                                    <div className={styles.houseInfo}>
                                        <div className={styles.room}>
                                            <Icon icon={bed} />
                                            {listing.bedrooms > 1
                                                ? `${listing.bedrooms} beds `
                                                : `${listing.bedrooms} bed `}
                                        </div>
                                        <div className={styles.room}>
                                            <Icon icon={bathtub} />
                                            {listing.bathrooms > 1
                                                ? `${listing.bathrooms} baths `
                                                : `${listing.bathrooms} bath `}
                                        </div>
                                    </div>
                                    <div className={styles.houseInfo}>
                                        {listing.furnished ? (
                                            <div className={styles.room}>
                                               <Icon icon={ic_countertops}/>
                                                <p>furnished</p>
                                            </div>) : (
                                            <div className={styles.room}>
                                                <Icon icon = {ic_no_luggage}/>
                                                <p>unfurnished</p>
                                            </div>
                                        )}
                                        {listing.parking ? (
                                            <div className={styles.room}>
                                                <Icon icon={car}/>
                                                parking
                                            </div>) : (
                                            <div className={styles.room}>
                                                <Icon icon={ic_taxi_alert}/>
                                                no parking
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h1 style={{ fontSize: '16px' }}>Description:</h1>
                        <p style={{ fontSize: '16px' }}>{listing.description}</p>
                    </div>)}
                </div>
            </div>
        </div>
    )
}