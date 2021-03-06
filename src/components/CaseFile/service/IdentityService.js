const graphql = require("graphql");
const iidentity = require("../types/impl/IIdentity").iidentity
var testData = require("../utility/exampleData").testData
const _ = require("lodash")
const { v4: uuidv4 } = require('uuid')
const mongodbService = require('../../../services/impl/MongodbService').object
// API GraphQL function definitions go here
class IdentityService {
  constructor () {}

  identitiesCollection = 'identities'
  databaseName = 'case-file'

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

  async getIdentity (user, obsId) {
    return await mongodbService.getDocument(this.identitiesCollection, this.databaseName,
      {
        id: obsId, 
        _user: user,
        _deleted: false
      }
    )
  }

  async getIdentities (query, deleted = false, user = "cypher") {
    const fixedQuery = Object.assign(query, { _deleted: deleted, _user: user })
    return await mongodbService.getMultipleDocuments(this.identitiesCollection, this.databaseName, fixedQuery)
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

  // getDataFromDatabase (arg) {
  //   return Object.values(testData).filter((data) => {
  //     return Object.values(data).includes(arg) && !data._deleted
  //   })
  // }

  insertModelIntoDatabase (identityModel) {
    const id = uuidv4()
    identityModel.id = id
    testData[identityModel.id] = identityModel
    return testData[identityModel.id]
  }

  async createIdentity (user, identityModel) {
    return await mongodbService.insertNewDocumentForUser(user, this.identitiesCollection, this.databaseName, identityModel)
  }

  async createNewGroupOfIdentities (user, collection, database, documents) {
    return await mongodbService.insertNewDocumentGroupForUser(user, this.identitiesCollection, this.databaseName, documents)
  }

  async updateIdentityWithDocument (user, id, document) {
    const filter = { id: id }
    const updateDocument = {
      $set: document
    }
    return await mongodbService.updateDocumentWithNewModel(this.identitiesCollection, this.databaseName, user, filter, updateDocument)
  }

  // TODO: Should be able to change some things multiple identities
  async updateMultipleIdentities (user, filter, document) {
    const updateDocument = {
      $set: document
    }
    return await mongodbService.updateMultipleDocumentsWithNewModel(this.identitiesCollection, this.databaseName, user, filter, updateDocument)
  }

  // TODO: Should be able to change some things multiple identities
  async deleteMultipleIdentities (user, idList) {
    const update = {
      _deleted: true
    }
    return await mongodbService.updateMultipleDocumentsWithNewModel(user, filter, updateDocument)
  }

  // TODO: Should be able to change some things multiple identities
  async deleteIdentity (user, id) {
    const document = {
      _deleted: true
    }
    return await this.updateIdentityWithDocument(user, id, document)
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