const generateTF = require('../request/generate-oidc-gold-tf');

// TODO: convert this into the unit tests
const result = generateTF({
  clientId: 'test-client',
  clientName: 'Test Client',
  validRedirectUris: ['http://localhost:3000'],
  idps: ['idir', 'github'],
  publicAccess: true,
  authType: 'browser-login',
  browserFlowOverride: 'idir stopper',
  tfModuleRef: 'dev',
  additionalRoleAttribute: 'groups',
});

console.log(result);
