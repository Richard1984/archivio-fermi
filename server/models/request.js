const mongoose = require('mongoose')

// Models
const {
  User
} = require('./user')

const {
  ObjectId
} = require('mongodb')

const RequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
    minlength: 1,
    trim: true,
    ref: 'User'
  }
})

RequestSchema.statics.addRequest = function (id) {
  const Request = this

  if (!ObjectId.isValid(id)) {
    return Promise.reject(new Error("L'ID fornito non è valido."))
  }

  return User.findById(id).then((user) => {
    if (!user) {
      return Promise.reject(new Error("Nessun utente registrato con l'ID fornito."))
    }

    const request = new Request({
      userId: id
    })

    return request.save().then((request) => {
      return Promise.resolve(request)
    }, (e) => {
      return Promise.reject(e)
    })
  }, (e) => {
    return Promise.reject(e)
  })
}

RequestSchema.statics.getRequests = function () {
  const Request = this

  return Request.find()
    .populate('userId')
    .then((requests) => {
      return Promise.resolve(requests)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}

RequestSchema.statics.acceptRequestById = function (id) {
  const Request = this

  return Request.findById(id)
    .then((request) => {
      return User.findById(request.userId)
    })
    .then((user) => {
      return user.update({
        state: 'active'
      })
    })
    .then((user) => {
      return Request.findByIdAndRemove(request.id)
    })
    .then((request) => {
      return Promise.resolve(request)
    })
    .catch((e) => {
      return Promise.reject(e)
    })
}

const Request = mongoose.model('Request', RequestSchema)

module.exports = {
  Request
}
