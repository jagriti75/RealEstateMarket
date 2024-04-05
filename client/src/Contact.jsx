import React from "react";
import { useState, useEffect } from "react";
import styles from "./Contact.module.css"
import { Link } from "react-router-dom";

export const Contact = ({ listing }) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        try {
            const fetchLandlord = async () => {
                const res = await fetch(`/api/user/${listing.userRef}`);

                const data = await res.json();

                console.log(data);

                setLandlord(data);
            }

            fetchLandlord();
        } catch (error) {
            console.log(error);
        }

    }, [listing.userRef]);
    return (
        <>
            {landlord && (
                <div className={styles.contactCard}>
                    <p>
                        Contact <span className={styles.contactName}>{landlord.username}</span>{' '}
                        for{' '}
                        <span className={styles.listingName}>{listing.name.toLowerCase()}</span>
                    </p>
                    <textarea
                        name='message'
                        id='message'
                        rows='2'
                        value={message}
                        onChange={onChange}
                        placeholder='Enter your message here...'
                        className={styles.messageArea}
                    ></textarea>

                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className={styles.mailButton}
                    >
                        Send Message
                    </Link>

                </div>
            )}
        </>
    );
}