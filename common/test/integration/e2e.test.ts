import { deriveAddress, sign, verify } from '@transia/ripple-keypairs'
import { UInt64, VarString } from '../../dist/npm/src/util/types';
import { BaseModel, Metadata } from '../../dist/npm/src/models';

const SampleModel = class extends BaseModel {
  updatedTime: UInt64
  updatedBy: VarString
  message: VarString

  constructor(
    updatedTime: UInt64,
    updatedBy: VarString,
    message: VarString
  ) {
    super()
    this.updatedTime = updatedTime
    this.updatedBy = updatedBy
    this.message = message
  }

  getMetadata(): Metadata {
    return [
      { field: 'updatedTime', type: 'uint64' },
      { field: 'updatedBy', type: 'varString', maxStringLength: 32 },
      { field: 'message', type: 'varString', maxStringLength: 250 },
    ]
  }

  toJSON() {
    return {
      updatedTime: this.updatedTime,
      updatedBy: this.updatedBy,
      message: this.message
    }
  }
}

describe('rules khan xrpl binary', () => {
  test('write xrpl success - read|auth write|auth', () => {
    const model = new SampleModel(
      BigInt(1685216402734), 
      'LWslHQUc7liAGYUryIhoRNPDbWucJZjj',
      'This is a message'
    )
    const path = '/MasterUserList/rLUEXYuLiQptky37CqLcm9USQpPiz5rkpD'
    const publicKey = 'ED01FA53FA5A7E77798F882ECE20B1ABC00BB358A9E55A202D0D0676BD0CE37A63'
    const privateKey = 'EDB4C4E046826BD26190D09715FC31F4E6A728204EADD112905B08B14B7F15C4F3'
    const request = {
      database: "one",
      method: "POST",
      path: path,
      // data: {},
      binary: model.encode(),
      auth: {
        type: 'xrpl',
        uid: deriveAddress(publicKey),
        signature: sign(model.encode(), privateKey),
        pk: publicKey
      }
    };
    const rules = `{
      "rules_version": "1",
      "service": "cloud.lmdb",
      "/databases/{database}/documents": {
        "/MasterUserList/{userId}": {
          "read": "request.auth.uid != null && request.auth.uid == userId && request.auth.type == xrpl",
          "write": "request.auth.uid != null && request.auth.uid == userId && request.auth.type == xrpl"
        }
      }
    }`;
    console.log(request);
    console.log(rules);
    expect(validateRequestAgainstRules(request, rules)).toBe(true)
  })
})