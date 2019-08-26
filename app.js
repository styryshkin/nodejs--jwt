const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const path = require('path')

const env = process.env.NODE_ENV || 'development'
const conf = require(path.resolve(__dirname, 'conf', env))

module.exports = async () => {

  const app = express()

  app.use(bodyParser.json())

  return app;
};
