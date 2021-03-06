
module.exports = function (app, db) { // receiving "app" and "db" instance
  app.get('/api/exercises/', (req, res, next) => {
    /*
        Returns all the exercises.
        Example usage:
      $ curl http://localhost:8000/api/exercises -X GET
       */
    console.log('Returning all exercises...')
    console.log('Search is set to: ')
    console.log(req.query.search)
    const search = req.query.search
    if (search === undefined) {
      // if no search terms defined
      var sql = 'select * from exercises'
    } else {
      var sql = 'select * from exercises where name like \'%\' || ? || \'%\'' // if search term works
    }
    const params = [search]
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

  app.get('/api/exercises/:id', (req, res, next) => {
    /*
        Returns a specific exercise
        Example usage (returns the exercise with ID = 5):
     $ curl http://localhost:8000/api/exercises/5 -X GET
      */
    console.log('Returning one exercise...')

    const sql = 'select * from exercises where id = ?'
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: row
      })
    })
  })

  app.post('/api/exercises/', (req, res, next) => {
    /*
        Posts a new exercise to be added to the db, for example a newly created exercise.

        Example usage:
        $ curl http://localhost:8000/api/exercises -X POST \
                   -d '
                   {
                      "name": "sit ups",
                      "description": "sit and raise your upper body",
                      "video_link": "youtube.com",
                   }'

        */
    console.log('Creating a new exercise...')
    const errors = []
    if (!req.body.description) {
      errors.push('No description specified')
    }
    if (!req.body.name) {
      errors.push('No name specified')
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(',') })
      return
    }
    const data = {
      name: req.body.name,
      description: req.body.description,
      video_link: req.body.video_link
    }
    const sql = 'INSERT INTO exercises (name, description, video_link, last_updated) VALUES (?,?,?,CURRENT_TIMESTAMP)'
    const params = [data.name, data.description, data.video_link]
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

  app.delete('/api/exercises/:id', (req, res, next) => {
    /*

        Deletes an exercise from the db

        */
    console.log('Deleting exercise...')

    const sql = 'delete from exercises where id = ?' // delete by ID
    const params = [req.params.id]
    db.get(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({ message: 'deleted', changes: this.changes })
    })
  })

  app.patch('/api/exercises/:id', (req, res, next) => {
    /*

        Modifies an existing exercise in the db.

        */
    console.log('Updating exercise...')
    const data = {
      name: req.body.name,
      description: req.body.description,
      video_link: req.body.video_link
    }
    const sql = 'UPDATE exercises set name = COALESCE(?,name), description = COALESCE(?,description), video_link = COALESCE(?,video_link), last_updated = CURRENT_TIMESTAMP WHERE id = ?'
    const params = [data.name, data.description, data.video_link, req.params.id]
    db.run(sql, params, function (err, row) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: row
      })
    })
  })
}
