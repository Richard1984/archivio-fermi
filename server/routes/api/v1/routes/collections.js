const express = require('express')
const router = express.Router()

const {
  getCollection,
  postCollection,
  patchCollection,
  deleteCollection,
  searchCollections
} = require('../../../../controllers/collections')

// Middleware
const {
  authenticate
} = require('../../../../middleware/authenticate')

const {
  asyncMiddleware
} = require('../../../../middleware/async')

const {
  editCollection
} = require('../../../../middleware/edit')

router.get('/:id', authenticate, asyncMiddleware(getCollection))
router.post('/', authenticate, asyncMiddleware(postCollection))
router.patch('/:id', authenticate, editCollection, asyncMiddleware(patchCollection))
router.delete('/:id', authenticate, editCollection, asyncMiddleware(deleteCollection))
router.post('/search/', authenticate, asyncMiddleware(searchCollections))

module.exports = router
