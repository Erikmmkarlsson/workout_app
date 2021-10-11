const getID = require('../../auth/getID')
const verifyToken = require('../../auth/')

module.exports = function (app, db) { // receiving "app" and "db" instance
    
    
  app.get('/api/reqList/',verifyToken, (req, res, next) => {
    /*
        Returns all the users.
        Example usage:
      $ curl http://localhost:8000/api/reqList -X GET
       */


    const search = req.query.search
    if (search === undefined) {
      // if no search terms defined
      var sql = 'select * from users where id != ?'
      
    } else {
      var sql = `select * from users where id != ? and name like '%' || ? || '%'` // if search term works
    }
    const params = [getID(req),search]
   
    console.log(params)
    console.log(sql)
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: rows
      })
    })
  })
 

 app.post('/api/reqList/', (req, res, next) => {
    /*
        Posts a new request to be added to the db.

        Example usage:
        $ curl http://localhost:8000/api/reqList -X POST \
                   -d '
                   {
                      "id_sender": Integer,
                      "id_reciever": Integer,
                   }'

        */
    console.log('Creating a new request...')
    const errors = []

    if (errors.length) {
      res.status(400).json({ error: errors.join(',') })
      return
    }
    const data = {
      id_sender: req.body.id_sender,
      id_reciever: req.body.id_reciever
    }
    const sql = 'INSERT INTO friendsrequest (id_sender, id_reciever) VALUES (?,?)'
    const params = [data.id_sender, data.id_reciever]
    db.run(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: data
      })
    })
  })
}