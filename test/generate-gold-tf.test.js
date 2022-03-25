const generateTF = require('../request/generate-gold-tf');

// TODO: convert this into the unit tests
const result = generateTF({
  clientName: 'test-client',
  validRedirectUris: ['http://localhost:3000'],
  publicAccess: true,
  browserFlowOverride: 'idir redirector',
  tfModuleRef: 'dev',
});

console.log(result);
