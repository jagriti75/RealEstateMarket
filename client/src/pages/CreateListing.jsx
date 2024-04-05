import React, { useState } from "react";
import styles from "./CreateListing.module.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import cross from "../assets/close.png";
import { useNavigate } from "react-router-dom";

export const CreateListing = () => {

    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log(formData);
    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
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
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
                return setError('You must upload at least one image');
            if (+formData.regularPrice < +formData.discountPrice)
                return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            alert(`listing ${data.name} created!`);
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className={styles.list}>
            <h1>Create Listing</h1>
            <form onSubmit={handleSubmit} className={styles.information} >
                <input type="text"
                    placeholder="name"
                    id='name'
                    minLength='5'
                    maxLength='62'
                    required
                    onChange={handleChange}
                    value={formData.name}
                />
                <textarea type="text"
                    placeholder="description"
                    id="description"
                    required
                    onChange={handleChange}
                    value={formData.description}
                />
                <input type="text"
                    placeholder="address"
                    id="address"
                    required
                    onChange={handleChange}
                    value={formData.address}
                />
                <div className={styles.box}>
                    <input type="checkbox"
                        id="rent"
                        onChange={handleChange}
                        checked={formData.type === "rent"}
                    />
                    <span>Rent</span>
                    <input type="checkbox"
                        id="sale"
                        onChange={handleChange}
                        checked={formData.type === "sale"}
                    />
                    <span>Sale</span>
                    <input type="checkbox"
                        id="furnished"
                        onChange={handleChange}
                        checked={formData.furnished}
                    />
                    <span>Furnished</span>
                    <input type="checkbox"
                        id="parking"
                        onChange={handleChange}
                        checked={formData.parking}
                    />
                    <span>Parking</span>
                    <input type="checkbox"
                        id="offer"
                        onChange={handleChange}
                        checked={formData.offer}
                    />
                    <span>Offer</span>
                </div>
                <div className={styles.bhk}>
                    <input type="number"
                        id="bedrooms"
                        min='1'
                        max='10'
                        onChange={handleChange}
                        value={formData.bedrooms}
                    />
                    <span>Beds</span>
                    <input type="number"
                        id="bathrooms"
                        min='1'
                        max='10'
                        onChange={handleChange}
                        value={formData.bathrooms}
                    />
                    <span>Baths</span>
                    <input type="number"
                        id="plotArea"
                        min='1'
                        max='1000000'
                        onChange={handleChange}
                        value={formData.plotArea}
                    />
                    <span>area</span>
                </div>
                <div className={styles.bhk}>
                    <input type="number"
                        id="regularPrice"
                        onChange={handleChange}
                        value={formData.regularPrice}
                    />
                    <span>Regular Price</span>
                    {formData.type== 'rent' && (<span>($/month)</span>)}
                    {
                        formData.offer && (
                            <div>
                                <input type="number"
                                    id="discountPrice"
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <span>Discounted Price</span>
                                {formData.type== 'rent' && (<span>($/month)</span>)}
                            </div>
                        )
                    }
                </div>
                <div className={styles.imageUpload}>
                    <p>
                        Images:
                        <span className={styles.lightgrey}>
                            The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className={styles.imageInput}>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            type='file'
                            id='images'
                            accept='image/*'
                            multiple
                        />
                        <button
                            type='button'
                            disabled={uploading}
                            onClick={handleImageSubmit}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className={styles.red}>{imageUploadError ? imageUploadError : ""}</p>
                    <div className={formData.imageUrls.length > 1 ? styles.imagesList : ""}>
                        {formData.imageUrls && formData.imageUrls.map((url,index) => (
                            <div key={url} className={styles.imageBox}>
                                <img src={url} className={styles.images} />
                                <button type='button' onClick={() => { handleRemoveImage(index) }}>
                                    <img src={cross} className={styles.cross} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.buttons}>
                <button className={styles.createListButton}>create</button>
                <button type='button' className={styles.backButton}>
                    <a href="/profile"> cancel </a>
                </button>
                </div>
                <p className={styles.red}>{error ? error : ""}</p>
            </form>
        </div>
    )
}