
export default function GetToken () {
  const key = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
  const parsedKey = JSON.parse(key)
  if (parsedKey != null) {
    const token = parsedKey.token

    return token
  }
}

/* Example use:

 axios.get('/api/manager/myUsers', {
      headers: {
        'x-access-token': GetToken()
      }
    })

*/
