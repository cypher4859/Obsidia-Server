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
})

app.listen(PORT);
console.log("HTTP server listening on port %s", PORT);