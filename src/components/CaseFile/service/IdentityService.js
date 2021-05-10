const graphql = require("graphql");
const iidentity = require("../types/impl/IIdentity").iidentity
const testData = require("../utility/exampleData").testData
const _ = require("lodash")

// API GraphQL function definitions go here
class IdentityService {
  constructor () {}
  
  getIdentity (searchTerm) {
    return this.getDataFromDatabase(searchTerm)
  }

  getIdentities (user = "cypher") {
    return Object.values(this.getAllIdentitiesFromDatabase()).filter((identity) => {
      return identity._user == user
    })
  }

  getQueries () {
    return `
      type Query {
        getIdentity(searchTerm: String): IIdentity
        getIdentities(user: String = cypher): [IIdentity]!
      }
    `
  }

  getMutations () {
    return `
      type Mutation {
        createNewIdentityCasefile(input: IdentityInput): IIdentity
        updateIdentityCasefile(id: ID!, input: IdentityInput): IIdentity
        deleteIdentityCasefile(id: ID!)
      }
    `
  }

  getInputs () {
    return `
      input IdentityInput {
        fullname: String
        first: String
        middle: String
        last: String
        suffix: String
        additional: String
        month: String
        day: String
        year: String
        date: String
        age: String
        socialSecurityNumber: String
        driversLicenseNumber: String
        passportIdentifier: String
        phones: [String]
        emails: [String]
        messagingApplications: [String]
        height: String
        weight: String
        eyeColor: String
        hairColor: String
        tattoos: [String]
        piercings: [String]
        physicalDeformities: [String]
        profile: String
      }
    `
  }

  getAllIdentitiesFromDatabase () {
    return Object.values(testData).filter((data) => {
      return data.id
    })
  }

  getDataFromDatabase (arg) {
    let result = {}
    Object.values(testData).forEach((data) => {
      if (Object.values(data).includes(arg)) {
        result = data
      }
    })
    return result
  }

  createIdentity (identityModel) {}

  updateIdentity (id, identityModel) {}

  deleteIdentity (id) {}
}

identityService = new IdentityService
exports.object = identityService