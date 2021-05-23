const { MongoClient } = require('mongodb');

class MongodbService {
  constructor () {
    this.initializeConnection()
  }

  client = {}

  initializeConnection (username = "root", password = "example", clusterUrl = "mongo:27017") {
    const uri = `mongodb://${username}:${password}@${clusterUrl}/?poolSize=20&writeConcern=majority`
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  async pingCheckDiagnostic () {
    try {
      await this.client.connect()
      await this.client
        .db("admin")
        .command({ ping: 1 })
      console.log('Connected Successfully!')
    } finally {
      await this.client.close()
    }
  }

  async createNewUser (user) {
    // Create new user.
  }
  async createNewCollectionForUser (user, collectionName, databaseName) {
    // Create the new collection
    try {
      await this.client.connect()
      const db = this.client.db(databaseName)
      await db.createCollection(collectionName)
    } catch {
      throw 'Could not create collection'
    }
    this.client.close()
  }
  async listDatabases (user) {
    try {
      await this.client.connect()
      const databaseList = (await this.client
        .db()
        .admin()
        .listDatabases()).databases
      return databaseList
    } catch (e) {
      console.error(e)
    }
  }

  async listCollections (user, db) {
    // List all the collections for a user
    try {
      await this.client.connect()
      const collectionList = await this.client
        .db(db)
        .listCollections({}, { nameOnly: true })
      return collectionList
    } catch (e) {
      console.error(e)
    }
  }

  async checkForCollection (user, collection, db) {
    // confirm that user's collection exists
  }

  async getCollectionForUser (user, collectionName, db) {
    // get collection for user
  }

  async getDocument (collectionName, db, query) {
    try {
      await this.client.connect()
      const results = await this.client.db(db).collection(collectionName).findOne(query)
      console.log(results)
      return results
    } catch {
      throw 'Could not find documents meeting criteria in the database!'
    }
    this.client.close()
  }

  async getMultipleDocuments (collectionName, db, query) {
    console.log('Grabbing the documents')
    try {
      await this.client.connect()
      const results = await this.client.db(db).collection(collectionName).find(query).toArray()
      return results
    } catch {
      throw 'Error attempting to find documents!'
    }
    this.client.close()
  }

  async dropCollection () {}
}

mongoService = new MongodbService
exports.object = mongoService