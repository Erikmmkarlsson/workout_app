const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('Get all workouts', async () => {
  // Sends GET Request to /test endpoint

  const res = await request.get('/api/workouts')

  expect(res.status).toBe(200)

  expect(res.body.message).toBe('success')
})

it('Get one workout', async () => {
  // Sends GET Request to /test endpoint

  const res = await request.get('/api/workouts/1')

  expect(res.status).toBe(200)

  expect(res.body.message).toBe('success')
})
