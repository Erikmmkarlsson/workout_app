


export default function GetToken(){
    const key = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    const parsedKey = JSON.parse(key);
    const token = parsedKey.token;
    
    return token;
}