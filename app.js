var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var graphql = require('graphql');
const bodyParser = require('body-parser');

const mongodbService = require('./src/services/impl/MongodbService').object
const root = require('./src/components/CaseFile/GQLTypes/schemaTypes').root
const types = require('./src/components/CaseFile/GQLTypes/schemaTypes').schemaTypes

const PORT = 8000;

var schema = graphql.buildSchema(types)
console.log(types)

var app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

function getRequestVariable (requestProperty, req, res, method = 'POST') {
  const requestVariable = method === 'POST' ? 'body' : 'query'
  if (req[requestVariable][requestProperty]) {
    return req[requestVariable][requestProperty]    
  } else {
    res.status(500).send(`Could not find ${requestProperty} in the request`)
    res.end()
    return null
  }
}

app.get('/', async function (req, res) {
  res.status(200)
  console.log('Status is: ', res.statusCode)
  await mongodbService.pingCheckDiagnostic()
  res.end()
})

app.post('/create-new-collection', async function (req, res) {
  let collection = getRequestVariable('collection', req, res)
  let user = getRequestVariable('user', req, res)
  let database = getRequestVariable('database', req, res)

  try {
    await mongodbService.createNewCollectionForUser(user, collection, database)
    res.status(200).send('Created the new collection')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.post('/insert-new-identity', async function (req, res) {
  let collection = getRequestVariable('collection', req, res)
  let user = getRequestVariable('user', req, res)
  let database = getRequestVariable('database', req, res)
  let document = getRequestVariable('document', req, res)

  try {
    await identityService.createIdentity(document)
    res.status(200).send('Created the new Identity')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.post('/insert-new-identity-group', async function (req, res) {
  let database = getRequestVariable('database', req, res)
  let collection = getRequestVariable('collection', req, res)
  let documents = getRequestVariable('documents', req, res)
  let user = getRequestVariable('user', req, res)

  try {
    await mongodbService.insertNewDocumentGroupForUser(user, collection, database, documents)
    res.status(200).send('Created the new group of identities')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.get('/list-databases', async function (req,res) {
  // list databases
  let user = getRequestVariable('user', req, res, 'GET')

  try {
    const databases = await mongodbService.listDatabases(user)
    res.status(200).send({ databases: databases })
  } catch {
    res.status(500).send('ERROR! Could not list databases')
  }
  res.end()
})

/// TODO: List out the collections correctly, this is weird (?)
app.get('/list-collections', async function (req, res) {
  // list collections
  let user = getRequestVariable('user', req, res, 'GET')
  let db = getRequestVariable('db', req, res, 'GET')
  // console.log('Whats in the query: ', req.query)

  try {
    const collections = await mongodbService.listCollections(user, db)
    console.log('Collections at the top of the heirarchy: ', collections)
    res.status(200).send({ collections: collections })
  } catch {
    res.status(500).send('ERROR! Could not list collections')
  }
  res.end()
})

app.get('/get-identity', async function (req, res) {
  // get identity
  // list databases
  let user = getRequestVariable('user', req, res, 'GET')
  let id = getRequestVariable('id', req, res, 'GET')

  try {
    const results = await identityService.getIdentity(user, id)
    res.status(200).send(results)
  } catch {
    res.status(500).send('ERROR! Could not list databases')
  }
  res.end()
})

app.post('/get-identities', async function (req, res) {
  let user = getRequestVariable('user', req, res)
  let query = {}
  let deleted = false
  if (req.body.user) {
    user = req.body.user
  } else {
    res.status(500).send('Could not find a User in the request')
    res.end()
    return
  }

  if (req.body._deleted !== null) {
    deleted = req.body._deleted
  }

  if (req.body.query) {
    query = req.body.query
  }

  try {
    const results = await identityService.getIdentities(query, deleted)
    res.status(200).send(results)
  } catch {
    res.status(500).send('Could not find any Identities')
  }
  res.end()
})

app.post('/update-identity', async function (req, res) {
  let documentId = getRequestVariable('documentId', req, res)
  let documentToUpdateWith = getRequestVariable('documentToUpdateWith', req, res)
  let user = getRequestVariable('user', req, res)

  try {
    await identityService.updateIdentityWithDocument(user, documentId, documentToUpdateWith)
    res.status(200).send('Updated document')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.post('/update-multiple-identities', async function (req, res) {
  let documentToUpdateWith = getRequestVariable('documentToUpdateWith', req, res)
  let user = getRequestVariable('user', req, res)
  let filter = getRequestVariable('filter', req, res)

  try {
    await identityService.updateMultipleIdentities(user, filter, documentToUpdateWith)
    res.status(200).send('Updated document')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.listen(PORT);
console.log("HTTP server listening on port %s", PORT);