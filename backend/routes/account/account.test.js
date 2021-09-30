const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)


it('Receives error', async () => {
  const res = await request.post('/api/login')

  expect(res.status).toBe(400)
  expect(res.body.message).toBe("All input is required")
})


it('Can login', async () => {
  const res = await request.post('/api/login')
    .send({
      email: "manager1@example.com",
      password: "admin123456"
    })

  expect(res.status).toBe(200)
  expect(res.body.email).toBe("manager1@example.com")
})

it('Cant login with invalid credentials', async () => {
  const res = await request.post('/api/login')
    .send({
      email: "manager1@example.com",
      password: "admin12456"
    })

  expect(res.status).toBe(400)
  expect(res.body.message).toBe("Invalid credentials")
})