const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcrypt')

const { SECRET } = require(path.resolve(__dirname, 'conf'))
const app = express()

// db
const courses = [
  { title: "Node.js Advanced" },
  { title: 'AWS Intro' }
]
const users = []

// middleware
app.use(bodyParser.json())

const auth = (req, res, next) => {
  if (req.headers && req.headers.auth && req.headers.auth.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.auth.split(' ')[1], SECRET, (err, decoded) => {
      if (err) return res.status(401).send()

      req.user = decoded
      console.log('authenticated as ', decoded.username)
      next()
    })
  }
  return res.status(401).send()
}

// route
app.post('/auth/register', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.status(500).send()

    users.push({
      username: req.body.username,
      passwordHash: hash
    })
    res.status(201).send('registered')
  })
})

app.post('/auth/login', (req, res) => {
  const foundUser = users.find(user => user.username === req.body.username)

  if (!foundUser) return res.status(401).send()

  bcrypt.compare(req.body.password, foundUser.passwordHash, (err, same) => {
    if (err || !same) return res.send(401).send()

    const token = jwt.sign({username: foundUser.username}, SECRET)
    return res.status(201).json({token})
  })
})

app.get('/courses', (req, res) => {
  res.send(courses)
})

app.post('/courses', auth, (req, res) => {
  courses.push({title: req.body.title})
  res.send(courses)
})

app.listen(3000)

