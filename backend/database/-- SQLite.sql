-- SQLite
select exercises.name,workout_exercises.num_sets, workout_exercises.num_reps, workout_exercises.num_seconds
from training_plans 
Inner join workout_events 
on training_plans.id= workout_events.training_plan_id
Inner join  workouts
on workout_events.workout_id= workouts.id
Inner join  workout_exercises
on workout_events.workout_id= workout_exercises.workout_id
Inner join  exercises
on workout_exercises.exercise_id = exercises.id
where training_plans.client_id = ?
AND workout_events.date= ?



