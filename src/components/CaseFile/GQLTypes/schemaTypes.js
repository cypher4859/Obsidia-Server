const IIdentity = require('../types/impl/IIdentity').iidentity
const identityService = require('../service/IdentityService').object

// Source of truth for all the CaseFile fields that we can get
exports.schemaTypes = `
${IIdentity.getIIdentityType()}
${identityService.getQueries()}
${identityService.getMutations()}
${identityService.getInputs()}
`

// Source of truth for the function definitions of API endpoints
exports.root = {
    getIdentity: ({searchTerm}) => { 
       return identityService.getIdentity(searchTerm)
    },

    getIdentities: ({user = "cypher"}) => {
        return identityService.getIdentities(user)
    },

    createIdentity: ({identityModel}) => {
        return identityService.createIdentity(identityModel)
    },

    updateIdentity: ({id, identityModel}) => {
        return identityService.updateIdentity(id, identityModel)
    },

    deleteIdentity: ({id}) => {
        return identityService.deleteIdentity(id)
    }
}