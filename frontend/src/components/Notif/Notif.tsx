import React, { useEffect, useState } from "react";
import "./Notif.css";

interface notifProp {
    notification: string;
    type: string;
    closeNotifParent: () => void;
}

const Notif = ({ notification, type, closeNotifParent }: notifProp) => {
    const [showNotif, setShowNotif] = useState("");
    const [color, setColor] = useState("red");


    useEffect(() => {
        setShowNotif(notification);
    }, [notification])

    useEffect(() => {
        if (type === "warning") {
            setColor("rgb(222,78,78)")
        }
        else if (type === "success") {
            setColor("rgb(43,248,70)")
        }
        else if (type === "info") {
            setColor("rgb(0,156,229")
        }
    }, [type])

    const closeNotification = () => {
        setShowNotif("")
        closeNotifParent();
    }

    if (typeof showNotif === "string" && showNotif.length !== 0) {
        return (
            <>
                <div className="notif-container">
                    <div className="notif" style={{ boxShadow: `20px 1px 30px 0.5px ${color}` }}>
                        <p>{showNotif}</p>
                        <button className="close-btn" onClick={closeNotification} >
                            &times;
                        </button>
                    </div>
                </div>
            </>
        );
    }
    else {
        return null
    }
}

export default Notif