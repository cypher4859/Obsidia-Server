const graphql = require("graphql");
const iidentity = require("../types/impl/IIdentity").iidentity
var testData = require("../utility/exampleData").testData
const _ = require("lodash")
const { v4: uuidv4 } = require('uuid')

// API GraphQL function definitions go here
class IdentityService {
  constructor () {}
  
  async getIdentity (user, obsId) {
    // return this.getDataFromDatabase(id)[0]
    return await mongodbService.getDocument(this.identitiesCollection, this.databaseName,
      {
        id: obsId, 
        _user: user,
        _deleted: false
      }
    )
  }

  async getIdentities (query, user = "cypher") {
    // return Object.values(this.getAllIdentitiesFromDatabase()).filter((identity) => {
    //   return identity._user == user
    // })
    const fixedQuery = Object.assign(query, { _deleted: false })
    return await mongodbService.getMultipleDocuments(this.identitiesCollection, this.databaseName, fixedQuery)
  }

  getDeletedIdentities (user = "cypher") {
    return Object.values(this.getDeletedIdentitiesFromDatabase()).filter((identity) => {
      return identity._user == user
    })
  }

  getQueries () {
    return `
      type Query {
        getIdentity(searchTerm: String): IIdentity
        getIdentities(user: String = cypher): [IIdentity]!
        getDeletedIdentities(user: String = cypher): [IIdentity]
      }
    `
  }

  getMutations () {
    return `
      type Mutation {
        createNewIdentityCasefile(newIdentityModel: IdentityInput): IIdentity
        updateIdentityCasefile(id: ID!, identityModel: IdentityInput): IIdentity
        deleteIdentityCasefile(id: ID!): IIdentity
      }
    `
  }

  getInputs () {
    return `input IdentityInput {
        id: String
        _user: String
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
      return data.id && !data._deleted
    })
  }

  getDeletedIdentitiesFromDatabase () {
    return Object.values(testData).filter((data) => {
      return data.id && data._deleted
    })
  }

  getDataFromDatabase (arg) {
    return Object.values(testData).filter((data) => {
      return Object.values(data).includes(arg) && !data._deleted
    })
  }

  insertModelIntoDatabase (identityModel) {
    const id = uuidv4()
    identityModel.id = id
    testData[identityModel.id] = identityModel
    return testData[identityModel.id]
  }

  createIdentity (identityModel) {
    return this.insertModelIntoDatabase(identityModel)
  }

  updateIdentity (id, newModel) {
    const oldModel = this.getIdentity(id)
    Object.keys(newModel).forEach((key) => {
      oldModel[key] = newModel[key]
    })
    return oldModel
  }

  deleteIdentity (id) {
    const identityToDelete = this.getIdentity(id)
    const displayIdentityToDelete = Object.assign({}, identityToDelete)
    if (!identityToDelete._deleted) {
      identityToDelete._deleted = true
      this.updateIdentity(identityToDelete.id, identityToDelete)
    }
    return displayIdentityToDelete
  }

  getDefaultItem () {
    return {
      _deleted: false,
      _user: '',
      id: uuidv4(),
      fullname: '',
      first: '',
      middle: '',
      last: '',
      suffix: '',
      additional: '',
      month: '',
      day: '',
      year: '',
      date: '',
      age: '',
      socialSecurityNumber: '',
      driversLicenseNumber: '',
      passportIdentifier: '',
      phones: [],
      emails: [],
      messagingApplications: [],
      height: '',
      weight: '',
      eyeColor: '',
      hairColor: '',
      tattoos: [],
      piercings: [],
      physicalDeformities: [],
      profile: ''
    }
  }
}

identityService = new IdentityService
exports.object = identityService