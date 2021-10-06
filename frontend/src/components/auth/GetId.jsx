
export default function GetID () {
    const key = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const parsedKey = JSON.parse(key)
    if (parsedKey != null) {
      const role = parsedKey.id
  
      return role
    }
  }
  