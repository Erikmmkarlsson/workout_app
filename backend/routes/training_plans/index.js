module.exports = function (app, db) {
  // receiving "app" and "db" instance
  app.get('/api/training_plans/', (req, res, next) => {
    /*
        Returns all training_plans.
        Example usage:
      $ curl http://localhost:8000/api/training_plans -X GET
       */
    console.log('Returning all training plans...')
    const sql = 'select * from training_plans'
    const params = []
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

  app.get('/api/training_plans/:id', (req, res, next) => {
    /*
        Returns a specific training_plan
        Example usage:
     $ curl http://localhost:8000/api/training_plans/5 -X GET
      */
    console.log('Returning one training plan...')

    const sql = 'select * from training_plans where id = ?' // search by ID
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

  app.post('/api/training_plans/', (req, res, next) => {
    /*
        Posts a new training_plan to be added to the db.

        Example usage:
        $ curl http://localhost:8000/api/training_plans -X POST \
                   -d '
                   {
                        "client_id":1,
                        "manager_id":2
                   }'

        */
    console.log('Creating a new training_plan...')
    const errors = []
    if (!req.body.client_id) {
      // if client id is not given
      console.log('Error 1')
      errors.push('No client_id specified')
    }
    if (!req.body.manager_id) {
      // if name is not given
      console.log('Error 2')
      errors.push('No manager_id specified')
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(',') })
      return
    }
    const data = {
      client_id: req.body.client_id,
      manager_id: req.body.manager_id
    }
    const sql =
      'INSERT INTO training_plans (client_id, manager_id) VALUES (?,?)'
    const params = [data.client_id, data.manager_id]
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

  app.delete('/api/training_plans/:id', (req, res, next) => {
    /*

        Deletes a training_plan from the db

        */
    console.log('Deleting training plan...')

    const sql = 'delete from training_plans where id = ?'
    const params = [req.params.id]
    db.get(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({ message: 'deleted', changes: this.changes })
    })
  })

  app.patch('/api/training_plans/:id', (req, res, next) => {
    /*

        Modifies an existing training plan in the db.

        */
    console.log('Updating training plan...')
    const data = {
      client_id: req.body.client_id,
      manager_id: req.body.manager_id
    }
    const sql =
      'UPDATE training_plans SET client_id = COALESCE(?,client_id), manager_id = COALESCE(?,manager_id) WHERE id = ?'
    // updating a workout according to the ID
    const params = [data.client_id, data.manager_id, req.params.id]
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
