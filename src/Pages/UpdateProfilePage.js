import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Components/ContextStore/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthReducer";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const UpdateProfilePage = () => {
    const [displayName, setDisplayName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [detailsUpdatedMsg, setDetailsUpdatedMsg] = useState(false);
    const authContext = useContext(AuthContext);
    const idToken = useSelector(state => state.authentication.idToken);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if(!idToken) {
            dispatch(authActions.logout());
            history.push('/');
        }
    }, [dispatch, idToken, history]);

    useEffect(() => {
        let isMounted = true;

        if(idToken && isMounted) {
            fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDbZODcPqKDtyrTyZl4UpkMuFUsMsfH9Aw`, {
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

        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDbZODcPqKDtyrTyZl4UpkMuFUsMsfH9Aw`, {
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
        }).then(res => {
            if(res.ok) {
                return res.json();
            } else {
                return res.json().then(data => {
                    alert(data.error.message);
                })
            }
        }).then((data) => {
            authContext.setDisplayName(data.displayName);
            alert('Display and photo are updated!');
        })
    }

    return <React.Fragment>
        <h2>Update Your Profile</h2>
        <form onSubmit={updateProfileSubmitHandler}>
            <input type='text' value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder='Display Name'/>
            <input type='url' value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} placeholder='place the URL for photo'/>
            <button type='submit'>Update</button>
        </form>
        <h4>{detailsUpdatedMsg ? 'Profile is completed!' : ''}</h4>
        <h6>{detailsUpdatedMsg ? 'Change the details if you want and click on UPDATE button.' : ''}</h6>
    </React.Fragment>
};

export default UpdateProfilePage;