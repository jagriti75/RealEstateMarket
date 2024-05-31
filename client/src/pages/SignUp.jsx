import React, { useState } from "react";
import styles from './SignUp.module.css';
import { useNavigate } from "react-router-dom";
import { Oauth } from '../Oauth'
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'

export const SignUp = () => {

    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const navigate = useNavigate();

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
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);

            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setLoading(false);
            setError(null);
            navigate("/signin");
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }

    };
    return (<div className={styles.signuppage}>
        <div className={styles.overlay}></div>
        <form onSubmit={handleSubmit} className={styles.signupform}>
            <h1>
                SIGN UP
            </h1>
            <div className={styles.passInput}>
                <input type="text" placeholder="username" id="username" onChange={handleChange} />
            </div>
            <div className={styles.passInput}>
                <input type="text" placeholder="email" id="email" onChange={handleChange} />
            </div>
            <div className={styles.passInput}>
                <input type={type} placeholder="password" id="password" onChange={handleChange} />
                <span className={styles.pass} onClick={handleToggle}>
                    <Icon className={styles.eyeIcon} icon={icon} />
                </span>
            </div>
            <button className={styles.signup} disabled={loading} type="submit">{loading ? "loading..." : "SIGN UP"}</button>
            <Oauth />
            <div className={styles.account}><span>Have an account?</span><a href="/signin">sign in</a></div>
        </form>
    </div>);
}