const getID = require('../../auth/getID')
const verifyToken = require('../../auth')

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


  app.get('/api/requestList/',verifyToken, (req, res, next) => {
    /*
        Returns all the users.
        Example usage:
      $ curl http://localhost:8000/api/reqList -X GET
       */

    var sql = 'select users.id,users.name,users.email from friendsrequest inner join users on friendsrequest.id_sender= users.id where id_reciever = ?'
    const params = [getID(req)]
   
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

  app.get('/api/UserrequestList/:id_sender/:id_reciever', (req, res, next) => {
    var sql = 'select * from friendsrequest where id_sender = ? and id_reciever = ?'
    const params = [req.params.id_sender, req.params.id_reciever]
    console.log(req.params.id_sender, req.params.id_reciever)
    console.log(sql)
    db.all(sql,params, (err, rows) => {
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

  app.post('/api/addtofriendslist/',verifyToken ,(req, res, next) => {

    const data = {
      id: req.body.id
    }
    const sql='INSERT INTO friendsList (id_user1,id_user2) VALUES (?,?)'
    const params = [data.id,getID(req)]
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
  app.get('/api/FriendsList/',verifyToken, (req, res, next) => {
    /*
        Returns all the users.
        Example usage:
      $ curl http://localhost:8000/api/reqList -X GET
       */

    var sql = 'select users.id,users.name,users.email from friendsList inner join users on friendsList.id_user1= users.id or friendsList.id_user2= users.id where ((friendsList.id_user2 = ?) OR (friendsList.id_user1 = ?)) and users.id != ?'
    

    const params = [getID(req),getID(req),getID(req)]
   
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


  app.get('/api/FriendsThatGaveMeAccess/',verifyToken, (req, res, next) => {
    var sql = 'select users.id,users.name,users.email from Giveaccess inner join users on from_user = users.id inner join friendsList on friendsList.id_user1= users.id or friendsList.id_user2= users.id where ((friendsList.id_user2 = ?) OR (friendsList.id_user1 = ?))  and users.id != ? and to_user = ?'
    

    const params = [getID(req),getID(req),getID(req),getID(req)]
   
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
  app.get('/api/FriendWaitingForAccess/',verifyToken, (req, res, next) => {
    var sql = 'select users.id,users.name,users.email from Pendingaccess inner join users on from_user = users.id inner join friendsList on friendsList.id_user1= users.id or friendsList.id_user2= users.id where ((friendsList.id_user2 = ?) OR (friendsList.id_user1 = ?))  and users.id != ? and to_user = ?'
    

    const params = [getID(req),getID(req),getID(req),getID(req)]
   
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

  app.delete('/api/reqList/',verifyToken, (req, res, next) => {
    const errors = []

    if (errors.length) {
      res.status(400).json({ error: errors.join(',') })
      return
    }
    const data = {
      id: req.body.id,
    }
    const sql = 'delete from friendsrequest where id_sender = ? and id_reciever = ?'
    const params = [data.id, getID(req)]
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

  app.delete('/api/removefriend/',verifyToken, (req, res, next) => {
    const errors = []

    if (errors.length) {
      res.status(400).json({ error: errors.join(',') })
      return
    }
    const data = {
      id: req.body.id,
    }
    const sql = 'delete from friendsList where (id_user1 = ? and id_user2 = ?) or (id_user1 = ? and id_user2 = ?) '
    const params = [data.id, getID(req),getID(req),data.id]
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

  app.get('/api/hasaccess/:id',verifyToken, (req, res, next) => {


    var sql = 'SELECT EXISTS(SELECT * FROM Giveaccess WHERE from_user = ? and to_user = ?) as a'
    const params = [parseInt(req.params.id),getID(req)]
    
    console.log(params)
    console.log(sql)
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      console.log(rows)
      res.json({
        message: 'success',
        data: rows
      })
    })
  })

  app.post('/api/giveaccess/',verifyToken ,(req, res, next) => {

    const data = {
      id: req.body.id
    }
    const sql='INSERT INTO Giveaccess (from_user,to_user) VALUES (?,?)'
    const params = [getID(req),data.id]
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

  app.delete('/api/removeaccess/',verifyToken, (req, res, next) => {
    const errors = []

    if (errors.length) {
      res.status(400).json({ error: errors.join(',') })
      return
    }
    const data = {
      id: req.body.id,
    }
    const sql = 'delete from Giveaccess where from_user= ? and to_user = ?'
    const params = [getID(req),data.id]
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

  app.post('/api/pendingaccess/',verifyToken ,(req, res, next) => {

    const data = {
      id: req.body.id
    }
    const sql='INSERT INTO Pendingaccess (from_user,to_user) VALUES (?,?)'
    const params = [getID(req),data.id]
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

  app.get('/api/haspendingacces/:id',verifyToken, (req, res, next) => {


    var sql = 'SELECT EXISTS(SELECT * FROM Pendingaccess WHERE from_user = ? and to_user = ?) as a'
    const params = [parseInt(req.params.id),getID(req)]
    
    console.log(params)
    console.log(sql)
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      console.log(rows)
      res.json({
        message: 'success',
        data: rows
      })
    })
  })
  app.get('/api/hasoutgoingpendingacces/:id',verifyToken, (req, res, next) => {


    var sql = 'SELECT EXISTS(SELECT * FROM Pendingaccess WHERE from_user = ? and to_user = ?) as a'
    const params = [getID(req),parseInt(req.params.id)]
    
    console.log(params)
    console.log(sql)
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      console.log(rows)
      res.json({
        message: 'success',
        data: rows
      })
    })
  })

  app.delete('/api/removependingaccess/',verifyToken, (req, res, next) => {
    const errors = []

    if (errors.length) {
      res.status(400).json({ error: errors.join(',') })
      return
    }
    const data = {
      id: req.body.id,
    }
    const sql = 'delete from Pendingaccess where from_user= ? and to_user = ?'
    const params = [data.id,getID(req)]


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