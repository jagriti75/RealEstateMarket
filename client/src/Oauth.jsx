import React from "react";
import styles from "./Oauth.module.css"
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from "./firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "./redux/user/userSlice";
import { useNavigate } from 'react-router-dom';
import googleLogo from '../src/assets/google.png'

export const Oauth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');

        } catch (error) {
            console.log("could not sign in", error);
        }
    }
    return (
        <div className={styles.googlelogin}>
         <p className={styles.grey}>continue with</p>
        <button onClick={handleGoogleClick} type="button">{<img className={styles.logo} src={googleLogo}/>}</button>
        </div>
    );
}