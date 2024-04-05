import React, { useEffect, useState } from "react";
import styles from "./Listing.module.css";
import { useParams } from "react-router-dom";
import loadingimg from "../assets/loading.png";
import ImageSlider from "../ImageSlider";

import furnished from "../assets/sofa.png";
import unfurnished from "../assets/unfurnished.png";
import parking from "../assets/parking.png";
import noparking from "../assets/no-parking.png";
import rupee from "../assets/rupee-indian.png";
import { useSelector } from "react-redux";
import { Contact } from "../Contact";


export const Listing = () => {

    const params = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    const [discPerc, setDiscPerc] = useState(0);
    const { currentUser } = useSelector((state) => state.user);
    const [contact , setContact] = useState(false);

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
    console.log(listing.imageUrls)
    return (
        <div className={styles.listing}>
            <div>
                {loading && (<img className={styles.loadingimg} src={loadingimg} alt="?" />)}
                {error && (<p>Something went wrong!</p>)}
                {listing && !error && !loading && (
                    <div className={styles.listingBox}>
                        <div>
                            <ImageSlider images={imageArray} />
                        </div>
                        <div className={styles.information}>
                            <h1>{listing.name}</h1>
                            <p className={styles.address}>{listing.address}</p>

                            <p>{listing.type == `rent` ? "For rent :" : "For sale :"}</p>
                            <span>{listing.offer ?
                                (<div>
                                    <span className={styles.rupee}><img src={rupee} /></span>
                                    <span className={styles.cut}>{listing.regularPrice}</span>
                                    <span className={styles.rupee}><img src={rupee} /></span>
                                    <span>{listing.discountPrice}</span>
                                    <span className={styles.vertical_line}></span>
                                    <span className={styles.area}>
                                        {listing.plotArea && (listing.plotArea + "sqft") } </span>
                                    <span>{listing.type == "rent" && <span className={styles.grey}>per month</span>}</span>
                                </div>)
                                : (<div> <span className={styles.rupee}><img src={rupee} /></span>
                                    <span>
                                        {listing.regularPrice}
                                    </span>
                                    <span>{listing.type == "rent" && listing.offer == false && <span className={styles.grey}>per month</span>}</span>
                                </div>)
                            }
                            </span>

                            {listing.offer && (<span className={styles.green}>({discPerc + "% OFF"})</span>)}

                            <p className={styles.desc}>{listing.description}</p>
                            <div className={styles.bathsandrooms}>
                                <span>
                            
                                    Bedrooms : <span>{listing.bedrooms}</span></span>
                                <span>
                               
                                    Bathrooms :  <span>{listing.bathrooms}</span></span>
                            </div>
                            <div className={styles.available}>
                                {listing.furnished ? (
                                    <div className={styles.details}>
                                        <img src={furnished} title='furnished' />
                                        <span className={styles.green}>furnished</span>
                                    </div>
                                ) : (
                                    <div className={styles.details}>
                                    <img src={unfurnished} title='unfurnished' />
                                    <span className={styles.red}>unfurnished</span>
                                </div>
                                )}
                                {listing.parking ? (
                                    <div className={styles.details}>
                                        <img src={parking} title='parking available' />
                                        <span className={styles.green}>parking available</span>
                                    </div>
                                ) :
                                    (<div className={styles.details} >
                                        <img src={noparking} title='parking not available' />
                                        <span className={styles.red}>parking not available</span>
                                    </div>
                                    )
                                }
                            </div>
                            <div>
                                {currentUser && currentUser._id !== listing.userRef &&
                                !contact &&
                                    (<button onClick={()=>setContact(true)} className={styles.contact}>Contact Owner</button>)}
                                {contact && <Contact listing={listing}/>}
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}