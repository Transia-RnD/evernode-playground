const HotPocket = require('hotpocket-js-client');
const xrpl = require('xrpl/dist/npm/')
const keypairs = require('ripple-keypairs')


function hexKey(key) {
  return key.reduce((accumulator, value) =>
  accumulator + value.toString(16).padStart(2, '0'), '').toUpperCase();
}
async function playground() {
  const userKeyPair = await HotPocket.generateKeys();
  console.log(userKeyPair);
  console.log(hexKey(userKeyPair.publicKey));
  console.log(hexKey(userKeyPair.privateKey));

  const message = {
    id: 'PHCzVUU057oJK2pAc5qM',
    type: 'message',
    command: 'create',
    data: {
      message: 'This is a message',
      updatedTime: 1685216402734,
      updatedBy: ' LWslHQUc7liAGYUryIhoRNPDbWucJZjj'
    }
  }
  JSON.stringify(message)
  const signature = keypairs.sign(
    'ED6B2D7CCE0BFE05BAABA44CC6A2A40E1D42D8871067153F676F1E2E8455E9AA3F',
    hexKey(userKeyPair.privateKey)
  )
  console.log(signature.length);
}
playground()