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

app.get('/', async function (req, res) {
  res.status(200)
  console.log('Status is: ', res.statusCode)
  await mongodbService.pingCheckDiagnostic()
  res.end()
})

app.post('/create-new-collection', async function (req, res) {
  let collection = ''
  let user = ''
  let database = ''

  if (req.body.collection) {
    collection = req.body.collection    
  } else {
    res.status(500).send('Could not find Collection in the request')
    res.end()
    return
  }

  if (req.body.user) {
    user = req.body.user
  } else {
    res.status(500).send('Could not find User in the request')
    res.end()
    return
  }

  if (req.body.database) {
    database = req.body.database
  } else {
    res.status(500).send('Could not find Database in the request')
    res.end()
    return
  }

  try {
    await mongodbService.createNewCollectionForUser(user, collection, database)
    res.status(200).send('Created the new collection')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.post('/insert-new-identity', async function (req, res) {
  console.log(req.body)
  let collection
  let user
  let database
  let document

  if (req.body.collection) {
    collection = req.body.collection    
  } else {
    res.status(500).send('Could not find Collection in the request')
    res.end()
    return
  }

  if (req.body.user) {
    user = req.body.user
  } else {
    res.status(500).send('Could not find User in the request')
    res.end()
    return
  }

  if (req.body.database) {
    database = req.body.database
  } else {
    res.status(500).send('Could not find Database in the request')
    res.end()
    return
  }

  if (req.body.document) {
    document = req.body.document
  } else {
    res.status(500).send('Could not find a Document in the request')
    res.end()
    return
  }

  try {
    await mongodbService.insertNewIdentityForUser(user, collection, database, document)
    res.status(200).send('Created the new Identity')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.post('/insert-new-identity-group', async function (req, res) {
  let database
  let collection
  let documents
  let user

  if (req.body.documents) {
    documents = req.body.documents
  } else {
    res.status(500).send('Could not find an array of Documents in the request')
    res.end()
    return
  }

  if (req.body.database) {
    database = req.body.database
  } else {
    res.status(500).send('Could not find a Database name in the request')
    res.end()
    return
  }

  if (req.body.collection) {
    collection = req.body.collection
  } else {
    res.status(500).send('Could not find a Collection in the request')
    res.end()
    return
  }

  if (req.body.user) {
    user = req.body.user
  } else {
    res.status(500).send('Could not find a User in the request')
    res.end()
    return
  }

  try {
    await mongodbService.insertNewIdentityGroupForUser(user, collection, database, documents)
    res.status(200).send('Created the new group of identities')
  } catch {
    res.status(500).send('ERROR something went wrong')
  }
  res.end()
})

app.get('/list-databases', async function (req,res) {
  // list databases
  let user
  try {
    user = req.query.user
  } catch {
    res.status(500).send('Could not find user in request')
  }

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
  let user
  let db
  // console.log('Whats in the query: ', req.query)
  if (req.query.user) {
    user = req.query.user
  } else {
    res.status(500).send('Could not find a User in the request')
    res.end()
    return
  }

  if (req.query.db) {
    db = req.query.db
  } else {
    res.status(500).send('Could not find a Database Name in the request')
    res.end()
    return
  }

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
  let user
  let id
  if (req.query.user) {
    user = req.query.user
  } else {
    res.status(500).send('Could not find a User in the request')
    res.end()
    return
  }

  if (req.query.id) {
    id = req.query.id
  } else {
    res.status(500).send('Could not find an Identity ID in the request')
    res.end()
    return
  }

  try {
    const results = await identityService.getIdentity(user, id)
    res.status(200).send(results)
  } catch {
    res.status(500).send('ERROR! Could not list databases')
  }
  res.end()
})
})

app.listen(PORT);
console.log("HTTP server listening on port %s", PORT);