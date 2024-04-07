import React, { useState ,useEffect } from "react";
import styles from "./Search.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export const Search = () => {

    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState(
        {
            searchTerm:'',
            type: 'all',
            parking: false,
            furnished: false,
            offer: false,
            sort: 'created_at',
            order: 'desc',
        }
    )
    const [listings , setListings] = useState([]);

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
            sort: sortFromUrl || 'created_at',
            order: orderFromUrl || 'desc',
          });
        }
        const fetchListings = async() =>{
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length == 0){
                
            }
            setListings(data);
        }

        fetchListings();
    } , [location.search]);

    console.log(listings)

    const handleChange=(e)=>{
        if(e.target.id === 'all' || e.target.id === 'rent'
        ||e.target.id === 'sale'){
            setSidebardata({...sidebardata , type: e.target.id})
        }

        if(e.target.id === 'searchTerm'){
            setSidebardata({...sidebardata , searchTerm : e.target.value})
        }

        if(e.target.id === 'furnished' ||
        e.target.id === 'parking'
        || e.target.id === 'offer') {
            setSidebardata({...sidebardata , [e.target.id] : e.target.checked ||
                e.target.checked === 'true' ? true : false})
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
      
            const order = e.target.value.split('_')[1] || 'desc';
      
            setSidebardata({ ...sidebardata, sort, order });
          }
        }

        console.log(sidebardata);

        const handleSubmit=(e)=>{
            e.preventDefault();

            const urlParams = new URLSearchParams();

            urlParams.set('searchTerm', sidebardata.searchTerm);
            urlParams.set('type' , sidebardata.type);
            urlParams.set('parking' , sidebardata.parking);
            urlParams.set('furnished' , sidebardata.furnished);
            urlParams.set('offer', sidebardata.offer);
            urlParams.set('sort' ,sidebardata.sort);
            urlParams.set('order', sidebardata.order);

            const searchQuery = urlParams.toString();

            navigate(`/search?${searchQuery}`); 


        }
    return (
        <div className={styles.searchContainer}>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.searchBox}>
                        <label className={styles.label}>
                            Search Term:
                        </label>
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
                        <label className={styles.label}>Type:</label>
                        <div className={styles.checkInput}>
                            <input
                                type='checkbox'
                                id='all'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.type === 'all'}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className={styles.checkInput}>
                            <input
                                type='checkbox'
                                id='rent'
                                onChange={handleChange}
                                checked={sidebardata.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className={styles.checkInput}>
                            <input
                                type='checkbox'
                                id='sale'
                                onChange={handleChange}
                                checked={sidebardata.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>
                        <div className={styles.checkInput}>
                            <input
                                type='checkbox'
                                id='offer'
                                onChange={handleChange}
                                checked={sidebardata.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className={styles.checkboxInput}>
                        <label className={styles.label}>Amenities:</label>
                        <div className={styles.checkInput}>
                            <input
                                type='checkbox'
                                id='parking'
                                onChange={handleChange}
                                checked={sidebardata.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className={styles.checkInput}>
                            <input
                                type='checkbox'
                                id='furnished'
                                onChange={handleChange}
                                checked={sidebardata.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className={styles.sortBox}>
                        <label className={styles.label}>Sort:</label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id='sort_order'
                        >
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className={styles.formButton}>
                        Search
                    </button>
                </form>
            </div>
            <div className={styles.listingContainer}>
                <h1>Listing results:</h1>
                {listings && listings.length > 0 && (
                                    <div className={styles.lists}>
                                        {listings.map((listing) => (
                                            <div key={listing._id} className={styles.listingBox} >
                                                <div >
                                                    <img src={listing.imageUrls[0]} />
                                                </div>
                                                <Link className={styles.heading} to={`/listing/${listing._id}`}>
                                                    <p >{listing.name}</p>
                                                </Link>
                                            </div>

                                        ))}
                                    </div>
                                )}
            </div>
        </div>
    )
}