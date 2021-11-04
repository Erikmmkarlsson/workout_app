# `workout_app`
A fullstack React + Node.js/Express web app with sqlite as dbms, utilizing Axios for api communication. 
Developed by Erik Karlsson, Mohammed Darouich, Andreas Windefelt, Hadi Ilani, Anton Youmortaji, Daniel Bredberg for intermediate 
software engineering course at Örebro University.


## `installation instructions`

Prerequisites:
* Node.js is installed on the system

Clone the repository, then enter the repository with your prefered method (`cd workout_app` for example)

Run these following commands to install everything:
```
npm install
cd frontend
npm install
cd ..
```

## `deploy instructions`

If you want to test and develop on your , run: `npm run dev` and frontend will start at `localhost:3000` and backend at `localhost:8000`. 

If you want to deploy it as a proper website or experience optimal performance run 
```
cd frontend
npm run build
cd ..
npm run production
```
and an optimal frontend will be built and served by the backend. Navigate to http://localhost:8000.

To run tests: `npm test`

