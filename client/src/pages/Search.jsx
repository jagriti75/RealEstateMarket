import React, { useState, useEffect } from "react";
import styles from "./Search.module.css";
import { useNavigate } from "react-router-dom";
import { ListingItem } from "../ListingItem";
import point from "../assets/placeholder.png"
import { Link } from "react-router-dom";



export const Search = () => {

    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'createdAt',
        order: "asc ",
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');


        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'asc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 3) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale'
        ) {
            setSidebardata({ ...sidebardata, type: e.target.id });
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'asc';
            setSidebardata({ ...sidebardata, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = 4
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 5) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };
    return (
        <div className={styles.searchContainer}>
            <div>
                {listings && listings.length > 0 && (
                    <div className={styles.coverImage}>
                        <img src={listings[0].imageUrls[0]} />
                        <div className={styles.overlay}></div>
                        <div className={styles.topList}>
                            <h1 className={styles.name}>{listings[0].name}</h1>
                            <p className={styles.address}>
                                <span><img src={point} />
                                </span><span>{listings[0].address}</span>
                            </p>
                            <p className={styles.price}>
                                {listings[0].offer
                                    ? listings[0].discountPrice.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR'
                                    })
                                    : listings[0].regularPrice.toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR'
                                    })}
                                {listings[0].type === 'rent' && ' / month'}
                            </p>
                            <div className={styles.houseInfo}>
                                <div className={styles.room}>
                                    {listings[0].bedrooms > 1
                                        ? `${listings[0].bedrooms} beds `
                                        : `${listings[0].bedrooms} bed `}
                                </div>
                                <div className={styles.room}>
                                    {listings[0].bathrooms > 1
                                        ? `${listings[0].bathrooms} baths `
                                        : `${listings[0].bathrooms} bath `}
                                </div>
                            </div>
                            <button className={styles.view}>
                                <Link to={`/listing/${listings[0]._id}`}>
                                   view
                                </Link>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.filterBox}>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.searchBox}>
                        <p className={styles.filterHeading}>WHERE WOULD YOU RATHER LIVE?</p>
                            <input
                                type='text'
                                id='searchTerm'
                                placeholder='Search...'
                                className={styles.inputBox}
                                value={sidebardata.searchTerm}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.checkboxInput}>
                            <div className={styles.checkInput}>
                                <input
                                    type='checkbox'
                                    id='all'
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'all'}
                                />
                                <span>ALL</span>
                            </div>
                            <div className={styles.checkInput}>
                                <input
                                    type='checkbox'
                                    id='rent'
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'rent'}
                                />
                                <span>RENT</span>
                            </div>
                            <div className={styles.checkInput}>
                                <input
                                    type='checkbox'
                                    id='sale'
                                    onChange={handleChange}
                                    checked={sidebardata.type === 'sale'}
                                />
                                <span>SALE</span>
                            </div>
                            <div className={styles.checkInput}>
                                <input
                                    type='checkbox'
                                    id='offer'
                                    onChange={handleChange}
                                    checked={sidebardata.offer}
                                />
                                <span>OFFER</span>
                            </div>
                        </div>
                        <div className={styles.checkboxInput}>
                            <div className={styles.checkInput}>
                                <input
                                    type='checkbox'
                                    id='parking'
                                    onChange={handleChange}
                                    checked={sidebardata.parking}
                                />
                                <span>PARKING</span>
                            </div>
                            <div className={styles.checkInput}>
                                <input
                                    type='checkbox'
                                    id='furnished'
                                    onChange={handleChange}
                                    checked={sidebardata.furnished}
                                />
                                <span>FURNISHED</span>
                            </div>
                        </div>
                        <div className={styles.sortBox}>
                            <select
                                onChange={handleChange}
                                id='sort_order'
                            >
                                <option value='createdAt_asc'>Oldest</option>
                                <option value='createdAt_desc'>Latest</option>
                                <option value='regularPrice_desc'>Price high to low</option>
                                <option value='regularPrice_asc'>Price low to high</option>
                            </select>
                        </div>
                        <button className={styles.formButton}>
                            Search
                        </button>
                    </form>
                </div>
                <div className={styles.listingContainer}>
                    <h1 className={styles.results}>Listing results:</h1>
                    {listings && listings.length > 0 && (
                        <div className={styles.lists}>
                            {listings.map((listing) => (
                                <ListingItem key={listing._id} listing={listing} />
                            ))}
                            {showMore && (
                                <button
                                    onClick={onShowMoreClick}
                                    className={styles.showMoreButton}>
                                    Show more
                                </button>
                            )}
                        </div>
                    )}
                    <p>{listings.length === 0 && (<p>No listings found!</p>)}</p>
                </div>
            </div>
        </div>
    )
}