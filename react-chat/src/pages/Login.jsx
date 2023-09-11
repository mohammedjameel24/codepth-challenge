import React, { useState } from "react";
import { auth, db, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const result = await signInWithPopup(auth, provider)
            await setDoc(doc(db, "users", result.user.uid ), {
                uid: result.user.uid,
                displayName: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
            })

            await setDoc(doc(db, "userChats", result.user.uid), {}, {merge: true})

            navigate("/");
        } catch (err) {
            console.log(err)
            setErr(true)
        }
    }


    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">NexChat</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <button>Sign in with google</button>
                    {err && <span>Something went wrong!!</span>}
                </form>
            </div>
        </div>
    )
}

export default Login