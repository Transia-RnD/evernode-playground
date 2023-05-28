import { generateKeys } from 'hotpocket-js-client'
// const lmdb = require('node-lmdb');

const nodeIp = process.env.REACT_APP_CONTRACT_NODE_IP || 'localhost'
const nodePort = process.env.REACT_APP_CONTRACT_NODE_PORT || '8081'

class InputStatus {
  status = ''
  reason = ''
  constructor(status, reason) {
    this.status = status
    this.reason = reason
  }
}
class Input {
  input = ''
  constructor(input) {
    this.input = input
  }

  async submissionStatus() {
    return new Promise((resolve) => {
      resolve(new InputStatus('accepted', 'Mock Reason'))
    })
  }
}
class Output {
  error = ''
  success = ''
  constructor(input) {
    this.input = input
  }
}

class MockClient {
  postInput = ''
  getInput = ''

  async submitContractInput(input) {
    return new Promise((resolve) => {
      if (JSON.parse(input).command === 'create') {
        this.postInput = input
      }
      console.log(`MOCK POST: ${this.postInput}`)
      resolve(new Input(this.postInput))
    })
  }

  async submitContractReadRequest(input) {
    return new Promise((resolve) => {
      console.log(`MOCK GET: ${input}`)
      this.getInput = input
      resolve(this.getInput)
    })
  }
}

class MockResponse {
  id = ''
  data = ''
  constructor(id, data = null) {
    this.id = id
    if (data) {
      this.data = JSON.parse(data).data
    }
  }
}

class ClientApp {
  // Provide singleton instance
  static instance = ClientApp.instance || new ClientApp()

  userKeyPair = null
  client = null
  isConnectionSucceeded = false
  server = `wss://${nodeIp}:${nodePort}`

  isInitCalled = false

  promiseMap = new Map()

  async init() {
    console.log('Initialized')
    if (this.userKeyPair == null) {
      this.userKeyPair = await generateKeys()
    }
    this.client = new MockClient()
    this.isInitCalled = true

    return true
  }

  async create(userId, message) {
    const id = generateKey(20).trim()
    const type = 'message'
    const command = 'create'
    const data = {
      message: message,
      updatedTime: Date.now(),
      updatedBy: userId,
    }
    return this.submit(id, type, command, data)
  }

  async get(id) {
    const type = 'message'
    const command = 'get'
    return this.submit(id, type, command)
  }

  async submit(id, type, command, data) {
    let resolver, rejecter
    const submitObj = {
      type: type,
      command: command,
    }

    if (data) {
      submitObj.data = data
    }

    try {
      const data = { id: id, ...submitObj }
      const inpString = JSON.stringify(data)
      console.log(data)
      this.client.submitContractInput(inpString).then((input) => {
        input.submissionStatus().then((s) => {
          if (s.status !== 'accepted') {
            console.log(`Ledger_Rejection: ${s.reason}`)
            throw `Ledger_Rejection: ${s.reason}`
          }
        })
      })

      if (type === 'message' && command === 'create') {
        return new MockResponse(id)
      }

      if (type === 'message' && command === 'get') {
        console.log(this.client.postInput)
        return new MockResponse(id, this.client.postInput)
      }

      return new Promise((resolve, reject) => {
        resolver = resolve
        rejecter = reject
        this.promiseMap.set(id, { resolver: resolver, rejecter: rejecter })
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

async function read(client, id, type, command) {
  const submitObj = {
    type: type,
    command: command,
  }
  try {
    const data = { id: id, ...submitObj }
    const inpString = JSON.stringify(data)
    const output = await client.submitContractReadRequest(inpString)
    if (!output) {
      return null
    }
    if (output.error) {
      throw output.error
    } else {
      return output.success
    }
  } catch (error) {
    throw error
  }
}

// program to generate random strings

// declare all characters
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateKey(length) {
  let result = ' '
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

async function main() {
  var client = new ClientApp()
  if (await client.init()) {
    const userId = generateKey(32)
    const response = await client.create(userId, 'This is a message')
    console.log(response.id)
    const messageData = await client.get(response.id)
    console.log(messageData)
  }
}
main()
