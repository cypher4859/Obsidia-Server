const graphql = require("graphql");
const { iidentity } = require("../types/IIdentity");

// query type
var identityQuery = new graphql.GraphQLObjectType({
  name: 'GetIdentity',
  fields: {
    type: iidentity,
    resolve: () => {
      return 'thing'
    }
  }
})
