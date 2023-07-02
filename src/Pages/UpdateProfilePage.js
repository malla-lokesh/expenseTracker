import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Components/ContextStore/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthReducer";
import { useNavigate } from "react-router-dom";
import './updateProfilePage.css';

const UpdateProfilePage = () => {
    const [displayName, setDisplayName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [detailsUpdatedMsg, setDetailsUpdatedMsg] = useState(false);
    const authContext = useContext(AuthContext);
    const idToken = useSelector(state => state.authentication.idToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(!idToken) {
            dispatch(authActions.logout());
            navigate('/');
        }
    }, [dispatch, idToken, navigate]);

    useEffect(() => {
        let isMounted = true;

        if(idToken && isMounted) {
            fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBWaj0fZXJolWpm6wbdt_Nd4SDxmFgeEFU`, {
                method: 'POST',
                    body: JSON.stringify({
                        idToken: idToken,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
            }).then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    res.json().then(data => {
                        alert(data.error.message);
                    })
                }
            }).then(data => {
                data.users.map(user => {
                    setDisplayName(user.displayName)
                    setProfilePicture(user.photoUrl)
                    setDetailsUpdatedMsg(true);
                    return null;
                })
            })
        }

        return () => {
            isMounted = false;
        }
    }, [idToken])

    const updateProfileSubmitHandler = (event) => {
        event.preventDefault();

        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBWaj0fZXJolWpm6wbdt_Nd4SDxmFgeEFU`, {
            method: 'POST',
            body: JSON.stringify({
                idToken: authContext.token,
                displayName: displayName,
                photoUrl: profilePicture,
                returnSecureToken: true
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async res => {
            if(res.ok) {
                return res.json();
            } else {
                const data = await res.json();
                alert(data.error.message);
            }
        }).then((data) => {
            authContext.setDisplayName(data.displayName);
            alert('Display and photo are updated!');
        })
    }

    return <React.Fragment>
        <h2>Update Your Profile</h2>
        <form onSubmit={updateProfileSubmitHandler}>
            <label>Display Name: </label>
            <input type='text' value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder='Display Name'/>
            <br/>
            <label>Photo: </label>
            <input type='url' value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} placeholder='place the URL for photo'/>
            <br/>
            <button className='updateProfileButton' type='submit'>Update</button>
        </form>
        <h4>{detailsUpdatedMsg ? 'Profile is completed!' : ''}</h4>
        <h6>{detailsUpdatedMsg ? 'Change the details if you want and click on UPDATE button.' : ''}</h6>
    </React.Fragment>
};

export default UpdateProfilePage;