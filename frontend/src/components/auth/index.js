import {createAuthProvider} from 'react-token-auth';
/*
This creates an auth provider which stores in local storage.
Not the best. Vulnerable to XSS attacks.
*/

/*This part doesn't work yet */
export const [useAuth, authFetch, login, logout] =
    createAuthProvider({
        accessTokenKey: 'access_token',
        onUpdateToken: (token) => fetch('localhost:8000/api/refresh', {
            method: 'POST',
            body: token.access_token
        })
        .then(r => r.json())
    });


export {default as GetToken} from "./GetToken";