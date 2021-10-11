
export default function GetName () {
    const key = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
    const parsedKey = JSON.parse(key)
    if (parsedKey != null) {
      const name = parsedKey.name
  
      return name
    }
  }
  