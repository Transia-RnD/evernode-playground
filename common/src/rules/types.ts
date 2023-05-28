export interface Auth {
  uid: string
  type: string
  signature: string
  pk: string
}

export interface Request {
  database: string
  method: string
  path: string
  data?: Record<string, any>
  binary?: string | null // signed data(write) or path(read)
  auth?: Auth
}

export interface Rules {
  rules_version: string
  service: string
  [key: string]: any
}

export interface Rule {
  read: boolean | string
  write: boolean | string
  [key: string]: any
}
