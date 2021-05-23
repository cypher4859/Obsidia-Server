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
  console.log(req.body)
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

})

app.listen(PORT);
console.log("HTTP server listening on port %s", PORT);