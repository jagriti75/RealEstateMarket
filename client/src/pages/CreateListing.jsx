import React, { useState } from "react";
import styles from "./CreateListing.module.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import cross from "../assets/close.png";

export const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        type: 'rent',
        bathrooms: 1,
        bedrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const[uploading , setUploading] = useState(false);
    console.log(formData);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promise = [];

            for (let i = 0; i < files.length; i++) {
                promise.push(storeImage(files[i]));
            }
            Promise.all(promise).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setUploading(false);
            }
            ).catch((err) => {
                setImageUploadError("error uploading (2 mb max per image)!");
                setUploading(false);
            })
            
        } else {
            setImageUploadError("you can only upload only 6 images per listing!");
            setUploading(false);
        }

    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`${progress} uploading`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }

            )
        })
    }

    const handleRemoveImage = (index)=>{
        setFormData({
            ...formData , imageUrls: formData.imageUrls.filter((_ , i)=> i!== index),
        })
    }

    return (
        <div className={styles.list}>
            <h1>Create Listing</h1>
            <form className={styles.information}>
                <input type="text"
                    placeholder="name"
                    id='name'
                    minLength='62'
                    maxLength='10'
                    required
                    value={formData.name}
                />
                <textarea type="text"
                    placeholder="description"
                    id="description"
                    required
                    value={formData.description}
                />
                <input type="text"
                    placeholder="address"
                    id="address"
                    required
                    value={formData.address}
                />
                <div className={styles.box}>
                    <input type="checkbox"
                        id="rent"
                        checked={formData.type === "rent"}
                    />
                    <span>Rent</span>
                    <input type="checkbox"
                        id="sale"
                        checked={formData.type === "sale"}
                    />
                    <span>Sale</span>
                    <input type="checkbox"
                        id="furnished"
                        checked={formData.furnished}
                    />
                    <span>Furnished</span>
                    <input type="checkbox"
                        id="parking"
                        checked={formData.parking}
                    />
                    <span>Parking</span>
                    <input type="checkbox"
                        id="offer"
                        checked={formData.offer}
                    />
                    <span>Offer</span>
                </div>
                <div className={styles.bhk}>
                    <input type="number"
                        id="beds"
                        value={formData.bedrooms}
                    />
                    <span>Beds</span>
                    <input type="number"
                        id="baths"
                        value={formData.bathrooms}
                    />
                    <span>Baths</span>
                </div>
                <div className={styles.bhk}>
                    <input type="number"
                        id="regPrice"
                        value={formData.regularPrice}
                    />
                    <span>Regular Price($/month)</span>
                    <input type="number"
                        id="discount"
                        value={formData.discountPrice}
                    />
                    <span>Discounted Price($/month)</span>
                </div>
                <div className={styles.imageUpload}>
                    <p>
                        Images:
                        <span className={styles.lightgrey}>The first image will be cover image(max 6)</span>
                    </p>
                    <div className={styles.imageInput}>
                        <input type="file"
                            onChange={(e) => setFiles(e.target.files)}
                            id="image"
                            accept="image/*"
                            multiple
                        />
                        <button disabled={uploading} type="button" onClick={handleImageSubmit}>
                            {uploading ? "uploading..." : "upload"}
                        </button>
                    </div>
                    <p className={styles.red}>{imageUploadError ? imageUploadError : " "}</p>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url , index) => (
                            <div key={url}className={styles.imageBox}>
                                <div>
                                    <img className={styles.images} src={url} alt="listing images" />
                                </div>
                                <div>
                                    <button type="button" onClick={()=>handleRemoveImage(index)}>
                                        <img className={styles.cross} src={cross}/>
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <button className={styles.createListButton}>Create Listing</button>
            </form>
        </div>
    )
}