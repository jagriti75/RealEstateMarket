import React, { useState, useRef, useEffect } from "react";
import styles from "./Profile.module.css";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import { app } from '../firebase';
import { useSelector } from "react-redux";
import edit from '../assets/edit.png'

export const Profile = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [name, setName] = useState(false);
    const [email, setEmail] = useState(false);
    const [pass, setPass] = useState(false);
    const [file, setFile] = useState(undefined);
    const [errorUpload, setErrorUpload] = useState(false);
    const [uploadPerc, setUploadPerc] = useState(0);
    const [formData, setFormData] = useState({});
    const fileRef = useRef(null);

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
                setErrorUpload(true);
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

    return (
        <div className={styles.container}>
            <h1>PROFILE</h1>
            <div >
                <form className={styles.information}>
                    <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
                    <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} />
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
                            {name ? <input type="text" id="username" /> : currentUser.username}
                        </span>
                        <span><button className={styles.edit} type='button' onClick={handleNameEdit}><img src={edit} /></button></span>
                    </div>
                    <div className={styles.info}><
                        span>email :</span>
                        <span>
                            {email ? <input type="text" id="email" /> : currentUser.email}
                        </span>
                        <span><button className={styles.edit} type='button' onClick={handleEmailEdit}><img src={edit} /></button></span>
                    </div>
                    <div className={styles.info}><
                        span>password :</span>
                        <span>
                            {pass ? <input type="text" id="password" /> : "xxxxx"}
                        </span>
                        <span><button className={styles.edit} type='button' onClick={handlePassEdit}><img src={edit} /></button></span>
                    </div>
                    <button className={styles.options}>Update</button>
                </form>
                <div className={styles.update}>
                    <a href="">Delete account</a>
                </div>

            </div>
        </div>
    );
}