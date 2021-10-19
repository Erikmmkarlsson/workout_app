const app = require('../../server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

let token = ''

it('Receives error', async () => {
  const res = await request.post('/api/login')

  expect(res.status).toBe(400)
  expect(res.body.message).toBe('All input is required')
})

it('Can login', async () => {
  const res = await request.post('/api/login')
    .send({
      email: 'manager1@example.com',
      password: 'admin123456'
    })

  token = res.body.token
  expect(res.status).toBe(200)
  expect(res.body.email).toBe('manager1@example.com')
})

it('Cant login with invalid credentials', async () => {
  const res = await request.post('/api/login')
    .send({
      email: 'manager1@example.com',
      password: 'admin12456'
    })

  expect(res.status !== 200)
  expect(res.body.message).toBe('Invalid credentials')
})

/*
it('Can register', async () => {
  const res = await request.post('/api/register')
    .send({
      name: 'Erok',
      email: 'man@example.com',
      password: 'admin12456',
      manager: "1"
    })

  expect(res.status).toBe(200)
  expect(res.body.message).toBe('success')
})

it('Can delete account', async () => {
  const res = await request.delete('/api/delete')
    .send({
      name: 'Erok',
      email: 'man@example.com',
      password: 'admin12456',
      manager: "1"
    })

  expect(res.status).toBe(200)
  expect(res.body.message).toBe('success')
})
*/
