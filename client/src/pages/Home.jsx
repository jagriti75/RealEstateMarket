import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import rupee from "../assets/rupee-indian.png";



export const Home = () => {

    const [listings, setListings] = useState([]);
    const [rental , setRental]=useState(0);
    const [sale , setSale]=useState(0);
    const [saleList , setSaleList] = useState([]);
    const [rentList , setRentList] = useState([]);
    

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
            let rental=0;
            let sale =0;
        
            console.log(data.type);
            data.forEach(element => {
                if(element.type=='rent'){
                    rental++;
                }
                if(element.type == 'sale'){
                    sale++;
                }
            });
            const saleList = [];
            const rentList = [];

           data.forEach((element)=>{
            if(element.type == 'sale'){
                saleList.push(element);
            }
           })

           data.forEach((element)=>{
            if(element.type == 'rent'){
                rentList.push(element);
            }
           })

           const saleListIntro = saleList.slice(0,3);
           const rentListIntro = rentList.slice(0,3);

            setSale(sale);
            setRental(rental);
            setSaleList(saleListIntro);
            setRentList(rentListIntro);
            setListings(data);

        }

        fetchListings();

    }, []);

    return (
        <div className={styles.listContainer}>
            {listings && (<div className={styles.listings} >
                <h1>rentals: </h1>
                <div  className={styles.box}>
                {(rentList.map((listing) => (
                    <div key={listing._id}>
                        {(
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
                                    <span className={styles.grey}>per month</span>
                                </div>)
                                : (<div> <span className={styles.rupee}><img src={rupee} /></span>
                                    <span>
                                        {listing.regularPrice}
                                    </span>
                                    <span>{listing.offer == false && <span className={styles.grey}>per month</span>}</span>
                                </div>)
                            }
                            </span>
                            </div>
                        )}
    
                    </div>
                ))
                )}
                <p><a href="/rentals">{((rental-3) >0) ? `+ ${rental - 3} more` : ""}</a></p>
                </div>
                <h1>sale: </h1>
                <div  className={styles.box}>
                {(saleList.map((listing) => (
                    <div key={listing._id}>
                        {(
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
                ))
                )}
                <p><a>{((sale-3) > 0) ? `+ ${sale - 3} more` : ""}</a></p>
                </div>
            </div>)}
        </div>
    );
}