import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import axios from 'axios';
import { CLIENT_ID } from './backend';

function App() {
    const [profile, setProfile] = useState([]);
    const clientId ="709377345934-kvtntcmhkqve447k24h6797ptdlb5de1.apps.googleusercontent.com";
    console.log(CLIENT_ID)

    useEffect(() => {
        const initClient = () => {
            gapi.auth2.init({
                clientId: clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = (res) => {
        setProfile(res.profileObj);
        console.log(res.tokenId)
        // Send a POST request



        const data = { tokenId: res.tokenId };
        axios.post('http://localhost:8000/api/googlelogin', data)
            .then(response => console.log("Google Login Success.", response))
            .catch(error => {
                console.log("Error", error)
            });

    };

    const onFailure = (err) => {
        console.log('failed', err);
    };

    const logOut = () => {
        setProfile(null);
    };

    return (
        <div>
            <h2>React Google Login</h2>
            <br />
            <br />
            {profile ? (  
                <div>
                    <img src={profile.imageUrl} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} />
                </div>
            ) : (
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}

                />
            )}
        </div>
    );
}
export default App;