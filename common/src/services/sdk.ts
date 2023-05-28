// import { Wallet, deriveAddress } from '@transia/xrpl'
import { Wallet, convertStringToHex } from '@transia/xrpl'
import { prepareRequest } from './api'
import { Request } from '../rules/types'
// import { Request, Response } from '../rules/types'
// import { DbService } from './db'
// import { User } from './types'

// function getPath(root: CollectionReference) {
//   console.log(root)
//   console.log(root.path)

//   let path = ''
//   // Layer 1
//   if (root !== null) {
//     path += root.path
//   }
//   if (root.doc !== null) {
//     path += root.doc.path
//   }
//   // // Layer 2
//   // if (this.collection.doc.col) {
//   //   path += this.collection.doc.col.path
//   // }
//   // if (this.collection.doc.col.doc) {
//   //   path += this.collection.doc.col.doc.path
//   // }
//   // // Layer 3
//   // if (this.collection.doc.col.doc.col) {
//   //   path += this.collection.doc.col.doc.col.path
//   // }
//   // if (this.collection.doc.col.doc.col.doc) {
//   //   path += this.collection.doc.col.doc.col.doc.path
//   // }
//   console.log(path)

//   return path
// }

export class CollectionReference {
  path: string = null
  doc: DocumentReference = null
  sdk: Sdk = null

  constructor(path: string, doc?: DocumentReference | null, sdk?: Sdk | null) {
    this.path = path
    this.doc = doc
    this.sdk = sdk
  }

  document(path: string) {
    this.doc = new DocumentReference(path, this)
    return this.doc
  }
}

export class DocumentReference {
  path: string = null
  col?: CollectionReference = null

  constructor(path: string, col?: CollectionReference | null) {
    this.path = path
    this.col = col
  }

  async get() {
    const path = `${this.col.path}/${this.col.doc.path}`
    console.log(`GET: ${path}`)
    console.log(convertStringToHex(path))
    const request = prepareRequest(
      '1',
      this.col.sdk.database,
      'GET',
      path,
      convertStringToHex(path),
      this.col.sdk.wallet.publicKey,
      this.col.sdk.wallet.privateKey
    )
    await this.col.sdk.submit(request)
  }

  async set(binary: string) {
    const path = `${this.col.path}/${this.col.doc.path}`
    console.log(`SET: ${path}`)
    console.log(binary)
    const request = prepareRequest(
      '1',
      this.col.sdk.database,
      'POST',
      path,
      binary,
      this.col.sdk.wallet.publicKey,
      this.col.sdk.wallet.privateKey
    )
    await this.col.sdk.submit(request)
  }

  async update(binary: string) {
    const path = `${this.col.path}/${this.col.doc.path}`
    console.log(`UPDATE: ${path}`)
    console.log(binary)
    const request = prepareRequest(
      '1',
      this.col.sdk.database,
      'PUT',
      path,
      binary,
      this.col.sdk.wallet.publicKey,
      this.col.sdk.wallet.privateKey
    )
    await this.col.sdk.submit(request)
  }

  async delete() {
    const path = `${this.col.path}/${this.col.doc.path}`
    console.log(`DELETE: ${path}`)
    console.log(convertStringToHex(path))
    const request = prepareRequest(
      '1',
      this.col.sdk.database,
      'DELETE',
      path,
      convertStringToHex(path),
      this.col.sdk.wallet.publicKey,
      this.col.sdk.wallet.privateKey
    )
    await this.col.sdk.submit(request)
  }

  collection(path: string) {
    this.col = new CollectionReference(path, this)
  }
}

export class Sdk {
  client: any = null
  wallet: Wallet = null
  database: string = null
  promiseMap = new Map()

  constructor(database: string, wallet: Wallet, client: any) {
    this.database = database
    this.wallet = wallet
    this.client = client
  }

  collection(path: string) {
    return new CollectionReference(path, null, this)
  }

  async submit(request: Request) {
    let resolver, rejecter
    try {
      const inpString = JSON.stringify(request)
      this.client.submitContractInput(inpString).then((input: any) => {
        input.submissionStatus.then((s: any) => {
          if (s.status !== 'accepted') {
            console.log(`Ledger_Rejection: ${s.reason}`)
            throw `Ledger_Rejection: ${s.reason}`
          }
        })
      })

      return new Promise((resolve, reject) => {
        resolver = resolve
        rejecter = reject
        this.promiseMap.set(request.id, {
          resolver: resolver,
          rejecter: rejecter,
        })
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
