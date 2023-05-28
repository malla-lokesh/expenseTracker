import React, { useContext, useState } from "react";
import AuthContext from "../Components/ContextStore/AuthContext";

const UpdateProfilePage = () => {
    const [displayName, setDisplayName] = useState('');
    const [profilePicture, setProfilePicture] = useState('https://drive.google.com/drive/u/0/folders/1KIV7bkNgKOYUI7Xvb4Sr7AL1_oWI_HiX');
    const authContext = useContext(AuthContext);

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
    </React.Fragment>
};

export default UpdateProfilePage;