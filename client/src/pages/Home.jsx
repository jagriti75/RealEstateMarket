import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import search from '../assets/search.png';
import { ListingItem } from "../ListingItem";
import house from "../assets/house.png";
import label from "../assets/label.png";
import building from "../assets/building.png";
import { Link } from "react-router-dom";
import more from "../assets/arrow.gif";
import next from "../assets/next.png"



export const Home = () => {

    const [listings, setListings] = useState([]);
    const [rental, setRental] = useState(0);
    const [sale, setSale] = useState(0);
    const [saleList, setSaleList] = useState([]);
    const [rentList, setRentList] = useState([]);
    const [offerList, setOfferList] = useState([]);


    const [searchTerm, setSearchTerm] = useState('');
    const [type, setType] = useState("rent");
    const [sort, setSort] = useState("createdAt");
    const [order, setOrder] = useState("asc")



    const navigate = useNavigate();

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
            let rental = 0;
            let sale = 0;

            console.log(data.type);
            data.forEach(element => {
                if (element.type == 'rent') {
                    rental++;
                }
                if (element.type == 'sale') {
                    sale++;
                }
            });
            const saleList = [];
            const rentList = [];

            data.forEach((element) => {
                if (element.type == 'sale') {
                    saleList.push(element);
                }
            })

            data.forEach((element) => {
                if (element.type == 'rent') {
                    rentList.push(element);
                }
            })

            data.forEach((element) => {
                if (element.offer == true) {
                    offerList.push(element);
                }
            })

            const saleListIntro = saleList.slice(0, 3);
            const rentListIntro = rentList.slice(0, 3);
            const offerListIntro = offerList.slice(0, 3);

            setSale(sale);
            setRental(rental);
            setSaleList(saleListIntro);
            setRentList(rentListIntro);
            setOfferList(offerListIntro);
            setListings(data);

        }

        fetchListings();

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(`searchTerm`, searchTerm);
        urlParams.set('type', type);
        urlParams.set('sort', sort);
        urlParams.set('order', order);
        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`)

    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get(searchTerm);
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [])

    const handleChange = (e) => {
        if (e.target.id === 'rent&sale') {
            console.log("entered target")
            if (e.target.value === 'rent') {
                console.log("rent");
                setType("rent")
            }

            if (e.target.value === 'buy') {

                console.log("sell");
                setType("sale")
            }
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'asc';

            setSort(sort);
            setOrder(order);
        }
    }

    return (
        <div className={styles.homeContainer}>
            <div className={styles.cover}>
                <div className={styles.search}>
                    <form onSubmit={handleSubmit}>
                        <input type="text"
                            placeholder="Search ..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value) }}
                        />
                        <select
                            onChange={handleChange}
                            id="rent&sale">
                            <option value="rent"
                            >Rent</option>
                            <option value="buy"
                            >Buy</option>
                        </select>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id='sort_order'
                        >
                            <option value='createdAt_asc'>Latest</option>
                            <option value='createdAt_desc'>Oldest</option>
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                        </select>
                        <button className={styles.searchButton}><img src={search} alt="?" /></button>
                    </form>
                </div>
                <div className={styles.overlay}></div>
                <div className={styles.signup}>
                    <Link to="/signup">
                        sign up for free
                    </Link>
                </div>
                <div className={styles.contactAgent}>
                    <h1>Contact Agent</h1>
                    <p>Call : (+91)000 0000</p>
                    <p>Email : agent123@gmail.com</p>
                    <p>Visit : 1234 , near community hall</p>
                </div>
                <div></div>
                <div className={styles.caption}>
                    <p>No place</p>
                    <p>like MarketPlace</p>
                </div>
                <button className={styles.browseListing}>
                    <a href="#rentals">
                        Browse Listings
                    </a>
                </button>
                <div className={styles.intro}>
                    <div className={styles.introMenu}>
                        <img className={styles.introImage} src={house} />
                        <h1>Homes for sale</h1>
                        <p>Explore exclusive house with great deals.</p>
                        <button><Link to="/search?searchTerm=&type=sale&parking=false&furnished=false&offer=false&sort=created_at&order=desc"
                        ><img className={styles.viewMore} src={more} />
                        </Link></button>
                    </div>
                    <div className={styles.introMenu}>
                        <img className={styles.introImage} src={building} />
                        <h1>Commercial Properties</h1>
                        <p>Wide range of options available.</p>
                        <button><Link to="/search?searchTerm=&type=rent&parking=false&furnished=false&offer=false&sort=created_at&order=desc
                        "><img className={styles.viewMore} src={more} />
                        </Link></button>
                    </div>
                    <div className={styles.introMenu}>
                        <img className={styles.introImage} src={label} />
                        <h1>List your property</h1>
                        <p>List your property to get customers.</p>
                        <button><Link to="/profile">
                            <img className={styles.viewMore} src={more} />
                        </Link></button>
                    </div>
                </div>
            </div>
            {listings && (<div className={styles.listings} >
                <p id="rentals" className={styles.section}>Explore our best options on rentals</p>
                <div className={styles.box}>
                    {(rentList.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))
                    )}
                    <p><a className={styles.more} href="
                    /search?searchTerm=&type=rent&parking=false&furnished=false&offer=false&sort=created_at&order=desc">
                        {(rental > 3) ?
                            (<img className={styles.next} src={next} />)
                            : ""}</a>
                    </p>
                </div>
                <p id="sale" className={styles.section}>Buy your dream house</p>
                <div className={styles.box}>
                    {(saleList.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))
                    )}
                    <p>
                        <a href="/search?searchTerm=&type=sale&parking=false&furnished=false&offer=false&sort=created_at&order=desc">
                            {(sale  > 3) ?
                                (<img className={styles.next} src={next} />)
                                : ""}
                        </a>
                    </p>
                </div>
                <p className={styles.section}>Get on offers</p>
                <div className={styles.box}>
                    {(offerList.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))
                    )}
                    <p>
                        <a href="/search?searchTerm=&type=all&parking=false&furnished=false&offer=true&sort=created_at&order=desc">
                            {(offerList > 3) ?
                            (<img className={styles.next} src={next} />)
                            : ""
                            }
                        </a>
                    </p>
                </div>
            </div>)}
        </div>
    );
}