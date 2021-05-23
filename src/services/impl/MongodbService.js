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

  async listDatabases () {
    try {
      console.log('client: ', this.client)
      await this.client.connect()
      const databaseList = await this.client.db().admin().listDatabases()
      databaseList.forEach((database) => {
        console.log(database)
      });
    } catch (e) {
      console.error(e)
    }
  }

  dropDatabase () {}
}

mongoService = new MongodbService
exports.object = mongoService