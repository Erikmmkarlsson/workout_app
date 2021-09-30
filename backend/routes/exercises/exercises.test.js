const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('Get all exercises', async () => {
  // Sends GET Request to /test endpoint

  const res = await request.get('/api/exercises')

  expect(res.status).toBe(200)

  expect(res.body.message).toBe('success')
})

it('Get one exercise', async () => {
  // Sends GET Request to /test endpoint

  const res = await request.get('/api/exercises/2')

  expect(res.status).toBe(200)

  expect(res.body.message).toBe('success')
})
