import { BaseModel, Metadata } from '../../dist/npm/src/models'
import { UInt64, VarString } from '../../dist/npm/src/util/types'

export class MessageModel extends BaseModel {
  updatedTime: UInt64
  updatedBy: VarString
  message: VarString

  constructor(updatedTime: UInt64, updatedBy: VarString, message: VarString) {
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
      message: this.message,
    }
  }
}
