const IIdentity = require('../types/impl/IIdentity').iidentity
const identityService = require('../service/IdentityService').object

// Source of truth for all the CaseFile fields that we can get
exports.schemaTypes = `
${IIdentity.getIIdentityType()}
${identityService.getQueries()}
${identityService.getInputs()}
${identityService.getMutations()}
`

// Source of truth for the function definitions of API endpoints
exports.root = {
    getIdentity: ({searchTerm}) => { 
       return identityService.getIdentity(searchTerm)
    },

    getIdentities: ({user = "cypher"}) => {
        return identityService.getIdentities(user)
    },

    createNewIdentityCasefile: ({newIdentityModel}) => {
        // console.log(newIdentityModel)
        return identityService.createIdentity(newIdentityModel)
    },

    updateIdentityCasefile: ({id, identityModel}) => {
        return identityService.updateIdentity(id, identityModel)
    },

    deleteIdentityCasefile: ({id}) => {
        return identityService.deleteIdentity(id)
    }
}