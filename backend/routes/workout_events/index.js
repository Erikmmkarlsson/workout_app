module.exports = function (app, db) {

    app.get("/api/workout_events/", (req, res, next) => {
        /*
        Returns all workout_events.
        Example usage:
      $ curl http://localhost:8000/api/workout_events -X GET
       */
        var sql = "select * from workout_events";
        console.log("Returning workout events...");
        const params = [];
        db.all(sql, params, (err, rows) => {
          // excute the query with specified parameters
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "success",
            data: rows,
          });
        });
      });
    
      app.get("/api/workout_events/:id", (req, res, next) => {
        /*
        Returns a specific workout event
        Example usage:
     $ curl http://localhost:8000/api/workout_events/5 -X GET
      */
        console.log("Returning one workout event...");
    
        const sql = "select * from workout_events where id = ?";
        const params = [req.params.id];
        
        db.get(sql, params, (err, row) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "success",
            data: row,
          });
        });
      });

    app.get("/api/users_workout_events/:id", (req, res, next) => {
        /*
        Returns all workout events specific for a user
        Example usage:
     $ curl http://localhost:8000/api/workout_events/5 -X GET
      */
        console.log("/api/users_workout_events/:id...");
        console.log(req.params.id);

        const sql = "select workout_events.date, workout_events.workout_id, workouts.name from training_plans \
                    Inner join workout_events on training_plans.id = workout_events.training_plan_id \
                    Inner join workouts on workout_events.workout_id = workouts.id \
                    where training_plans.client_id = ?";
        const params = [req.params.id];
        db.all(sql, params, (err, rows) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "success",
            data: rows
          });
          console.log(rows)
        });
      });

    
      app.post("/api/workout_events/", (req, res, next) => {
        /*
        Posts a new workout_event to be added to the db.
    
        Example usage:
        $ curl http://localhost:8000/api/workout_events -X POST \
                   -d '
                   {
                      "training_plan_id": 1,
                      "workout_id": 1,
                      "date": 2021-01-01,
                      "is_done": 0,
                      "manager_comment": "Take it slow",
                      "client_comment": "It went well"
                   }'
    
        */
        console.log("Adding workout to training plan...");
        const errors = [];
        if (!req.body.training_plan_id) {
          console.log("Error 1");
          errors.push("No training plan specified");
        }
        if (!req.body.workout_id) {
          console.log("Error 2");
          errors.push("No workout specified");
        }
        if (errors.length) {
          res.status(400).json({ error: errors.join(",") });
          return;
        }
        const data = {
          training_plan_id: req.body.training_plan_id,
          workout_id: req.body.workout_id,
          date: req.body.date,
          is_done: req.body.is_done,
          manager_comment: req.body.manager_comment,
          client_comment: req.body.client_comment,
        };
        const sql =
          "INSERT INTO workout_events (training_plan_id, workout_id, date, is_done, manager_comment, client_comment) VALUES (?,?,?,?,?,?)";
        const params = [
          data.training_plan_id,
          data.workout_id,
          data.date,
          data.is_done,
          data.manager_comment,
          data.client_comment,
        ];
        db.run(sql, params, function (err, result) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "success",
            data: data,
          });
        });
      });
    
      app.delete("/api/workout_events/:id", (req, res, next) => {
        /*
    
        Deletes a workout event from the db
    
        */
        console.log("Removing workout from training plan...");
    
        const sql = "delete from workout_events where id = ?";
        const params = [req.params.id];
        db.get(sql, params, function (err, result) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({ message: "deleted", changes: this.changes });
        });
      });
    
      app.patch("/api/workout_events/:id", (req, res, next) => {
        /*
    
        Modifies an existing workout event in the db.
    
        */
        console.log("Updating workout event...");
        const data = {
          training_plan_id: req.body.training_plan_id,
          workout_id: req.body.workout_id,
          date: req.body.date,
          is_done: req.body.is_done,
          manager_comment: req.body.manager_comment,
          client_comment: req.body.client_comment,
        };
        const sql =
          "UPDATE workout_events set training_plan_id = COALESCE(?,training_plan_id), workout_id = COALESCE(?,workout_id), date = COALESCE(?,date), is_done = COALESCE(?,is_done), manager_comment = COALESCE(?,manager_comment), client_comment = COALESCE(?,client_comment) WHERE id = ?";
        const params = [
          data.training_plan_id,
          data.workout_id,
          data.data,
          data.is_done,
          data.manager_comment,
          data.client_comment,
          req.params.id,
        ];
        db.run(sql, params, function (err, row) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "success",
            data: row,
          });
        });
      });


}