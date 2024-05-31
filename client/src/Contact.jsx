import React from "react";
import { useState, useEffect } from "react";
import styles from "./Contact.module.css"
import { Link } from "react-router-dom";
import cross from "./assets/close.png";
import email from "./assets/email.png";
import { useNavigate } from "react-router-dom";

export const Contact = ({ listing },contact) => {
    const[error , setError] = useState(null);
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const [cardOpen , setCardOpen] = useState(contact);
    const navigate = useNavigate();

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        try {
            const fetchLandlord = async () => {
                const res = await fetch(`/api/user/${listing.userRef}`);

                const data = await res.json();

                if(data.success === false){
                    alert("Please sign in before proceeding further!")
                    navigate('/signin');
                }

                console.log(data);

                setLandlord(data);
            }

            fetchLandlord();
        } catch (error) {
            console.log(error);

        }

    }, [listing.userRef]);

   const setCard = () =>{
        setCardOpen(cardOpen => !cardOpen);
   }


    return (
        <>
            {cardOpen ? (landlord && (
                <div className={styles.contactCard}>
                    <button className={styles.closeButton} onClick={setCard}>
                        <img  src={cross}/>
                    </button>
                    <p>
                      <span className={styles.contactName}>{landlord.username}</span>
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
                        SEND MESSAGE
                    </Link>

                </div>
            )) : (
                <button className={styles.contact} onClick={setCard}>
                    <img  src={email} style={{ height: '20px', width: '20px' }}/>
                </button>
            )}
            <p>{error && error}</p>
        </>
    );
}