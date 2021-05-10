var { graphqlHTTP } = require('express-graphql');
var graphql = require('graphql');

class IIdentity {
  getIIdentityType () {
    return `type IIdentity {
      _user: String
      id: String!
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
    }`
  }
}

iidentity = new IIdentity()
exports.iidentity = iidentity

