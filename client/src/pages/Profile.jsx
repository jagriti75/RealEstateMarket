import React, { useState, useRef, useEffect } from "react";
import styles from "./Profile.module.css";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import { app } from '../firebase';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    updateUserStart, updateUserSuccess, updateUserFailure
    , deleteUserStart, deleteUserFailure, deleteUserSuccess, signOutUserSuccess, signOutUserStart, signOutUserFailure
} from "../redux/user/userSlice";
import edit from '../assets/edit.png'
import profile from '../assets/profile.webp'

export const Profile = () => {

    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [name, setName] = useState(false);
    const [email, setEmail] = useState(false);
    const [pass, setPass] = useState(false);
    const [file, setFile] = useState(undefined);
    const [errorUpload, setErrorUpload] = useState(false);
    const [uploadPerc, setUploadPerc] = useState(0);
    const [formData, setFormData] = useState({});
    const [success, setUpdateSuccess] = useState(false);
    const [listings , setListings]=useState([]);
    const [listingError , setListingError]=useState(null);
    const fileRef = useRef(null);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress + " " + "% done");
                setUploadPerc(progress);
            },
            (error) => {
                setErrorUpload(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );

    }
    const handleNameEdit = () => {
        setName(true);
    }

    const handleEmailEdit = () => {
        setEmail(true);
    }

    const handlePassEdit = () => {
        setPass(true);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        console.log(formData);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async (e) => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (success.data === false) {
                dispatch(deleteUserFailure(data));
                return;
            }

            dispatch(deleteUserSuccess(data));
            navigate('/signup');
        } catch (error) {
            dispatch(deleteUserFailure(error));
        }
    }

    const handleSignout = async (e) => {
        try{
            dispatch(signOutUserStart());
        const res = await fetch(`/api/auth/signout`, {
            method: 'GET',
        });
        navigate('/signin');
        const data = res.json();
        if(success == true){
            dispatch(signOutUserSuccess(data));
        }
        dispatch(signOutUserSuccess(data));
    }catch(error){
        dispatch(signOutUserFailure());
            console.log(error);
        }
    }

    const handleShowListings = async(e) => {
        try{
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();

            if(data.success === false){
                setListingError(error);
                return;
            }

            setListings(data);
             
        }catch(error){
            setListingError(error);
        }
    }

    const handleRemoveListing  = async (listingId) => {
        try {
          const res = await fetch(`/api/listing/delete/${listingId}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            return;
          }
    
          setListings((prev) =>
            prev.filter((listing) => listing._id !== listingId)
          );
        } catch (error) {
          console.log(error.message);
        }
      };

    return (
        <div className={styles.container}>
            <h1>PROFILE</h1>
            <div >
                <form onSubmit={handleSubmit} className={styles.information} >
                    <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
                    <img onClick={() => fileRef.current.click()} src={profile || currentUser.avatar} />
                    <p>
                        {errorUpload ? (
                            <span className={styles.red}>
                                Error Image upload (image must be less than 2 mb)
                            </span>
                        ) : uploadPerc > 0 && uploadPerc < 100 ? (
                            <span className={styles.green}>{`Uploading ${uploadPerc}%`}</span>
                        ) : uploadPerc === 100 ? (
                            <span className={styles.green}>Image successfully uploaded!</span>
                        ) : (
                            ''
                        )}
                    </p>
                    <div className={styles.info}>
                        <span>name :</span>
                        <span>
                            {name ? <input type="text" id='username' onChange={handleChange} /> : currentUser.username}
                        </span>
                        <span><button className={styles.edit} type='button' onClick={handleNameEdit} ><img src={edit} /></button></span>
                    </div>
                    <div className={styles.info}><
                        span>email :</span>
                        <span>
                            {email ? <input type="text" onChange={handleChange} id='email' /> : currentUser.email}
                        </span>
                        <span><button className={styles.edit} type='button' onClick={handleEmailEdit} ><img src={edit} /></button></span>
                    </div>
                    <div className={styles.info}><
                        span>password :</span>
                        <span>
                            {pass ? <input type="password" id='password' onChange={handleChange} /> : currentUser.password}
                        </span>
                        <span><button className={styles.edit} type='button' onClick={handlePassEdit} ><img src={edit} /></button></span>
                    </div>
                    <div className={styles.modify}>
                        <span onClick={handleDeleteUser}> Delete account </span>
                        <span onClick={handleSignout}> Sign out </span>
                    </div>
                    <button disabled={loading} type="submit" className={styles.options}>
                        {loading ? "loading..." : "update"}
                    </button>
                    <button className={styles.options}>
                        <a href ="create-listing">create tour</a>
                    </button>
                </form>
                <div>
                    <p className={styles.red}>{error ? error : " "}</p>
                    <p className={styles.green}>{success ? "updated successfully!" : " "}</p>
                </div>
                <div className={styles.listing}>
                    <button className={styles.showListingbutton} 
                    onClick={handleShowListings}>
                        show listings
                    </button>
                    <div >
                        {listings && listings.length>0 && (
                            <div className={styles.lists}>
                                {listings.map((listing)=>(
                                    <div key={listing._id} className={styles.listingBox} >
                                        <p>{listing.name}</p>
                                        <img src={listing.imageUrls[0]}/>
                                        <div>
                                            <button onClick={()=>{handleRemoveListing(listing._id)}}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <p>{listingError ? listingError : ""}</p>
                </div>
                
            </div>
        </div>
    );
}