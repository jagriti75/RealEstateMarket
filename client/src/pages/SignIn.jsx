import React, { useState } from "react";
import styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpStart, signInFailure, signInSuccess } from "../redux/user/userSlice";
import { Oauth } from "../Oauth";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'

export const SignIn = () => {

    const [formData, setFormData] = useState({});
    const { error, loading } = useSelector((state) => state.user);
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text')
        } else {
            setIcon(eyeOff)
            setType('password')
        }
    }


    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.id]: e.target.value,
            }
        );
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            dispatch(signUpStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);

            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            dispatch(signInFailure(error.message));
        }

    };
    return (<div className={styles.container}>
        <h1>
            SIGN IN
        </h1>
        <form onSubmit={handleSubmit} className={styles.signinpage}>
            <div className={styles.passInput}>
            <input type="text" placeholder="email" id="email" onChange={handleChange} />
            </div>
            <div className={styles.passInput}>
                <input type={type} placeholder="password" id="password" onChange={handleChange}
                 />
                <span className={styles.pass} onClick={handleToggle}>
                    <Icon className={styles.eyeIcon} icon={icon} />
                </span>
            </div>
            <button disabled={loading} type="submit" className={styles.sign}>{loading ? "loading..." : "SIGN IN"}</button>
            <Oauth />
            <div className={styles.direct}><span >Do not have an account?</span><a href="/signup">sign up</a></div>
        </form>
        <div className={styles.red}>{error}</div>
    </div>);
}
