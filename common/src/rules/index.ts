import { deriveAddress } from "@transia/xrpl";
import { Auth, Request, Rule, Rules } from "./types";
import { verify } from "@transia/ripple-keypairs/dist";

const getId = (string: string) => {
  const regex = /{([^}]+)}/;
  const matches = regex.exec(string);
  if (matches) {
    return matches[1]
  } else {
    return null
  }
}

function validateXrplAuth(data: string, auth: Auth) {
  console.log('VALIDATE XRPL REQUEST');
  // console.log(data);
  // console.log(auth);
  // console.log(verify(data, auth.signature, auth.pk));
  return verify(data, auth.signature, auth.pk) && deriveAddress(auth.pk) === auth.uid
}

// const hasPermission = (path, id) => {
//   // get db entry
// }

function validateAuth(str: string, pathId: string, req: Request): boolean {
  console.log('AUTH RULE TRIGGERED');
  // console.log(str);
  // console.log(pathId);
  // console.log(auth);
  const auth = req.auth as Auth
  const arr = str.split(' ');
  if (arr[0] === 'request.auth.uid' && arr[1] === '!=' && arr[2] === 'null') {
    // console.log('request.auth.uid != null');
    // console.log(auth.uid === null);
    if (auth.uid === null) { return false }
  }
  if (arr[0] === 'request.auth.uid' && arr[1] === '==' && arr[2] === 'null') {
    // console.log('request.auth.uid == null');
    // console.log(auth.uid !== null);
    if (auth.uid !== null) { return false }
  }
  if (arr[4] === 'request.auth.uid' && arr[5] === '!=' && arr[6] === 'userId') {
    // console.log('request.auth.uid != uid');
    // console.log(auth.uid === pathId);
    if (auth.uid === pathId) { return false }
  }
  if (arr[4] === 'request.auth.uid' && arr[5] === '==' && arr[6] === 'userId') {
    // console.log('request.auth.uid == uid');
    // console.log(auth.uid !== pathId);
    if (auth.uid !== pathId) { return false }
  }
  if (arr[8] === 'request.auth.type' && arr[9] === '==' && arr[10] === 'xrpl') {
    // console.log('request.auth.type == 'xrpl');
    // console.log(auth.type !== 'xrpl');
    if (auth.type === 'xrpl') { return validateXrplAuth(req.binary as string, auth) }
  }
  console.log('AUTH VALIDATED');
  return true;
}

export function validateRequestAgainstRules(req: Request, rulesJson: string): boolean {
  const rules: Rules = JSON.parse(rulesJson);
  const pathParams: string[] = Object.keys(rules["/databases/{database}/documents"]);
  for (let i = 0; i < pathParams.length; i++) {
    const pathParam = pathParams[i];
    console.log(`CHECKING PATH: ${pathParam}`);
    const idName = getId(pathParam)
    const ruleParamRegex = pathParam.replace(/\{.*\}/, "([A-Za-z0-9]{1,64})");
    const result = req.path.match(ruleParamRegex);
    if (result) {
      const pathId = result[1]
      const rule: Rule = rules["/databases/{database}/documents"][pathParam];
      console.log(rule);
      
      // READ
      if (rule.read !== null && req.method === "GET") {
        console.log('READ VALIDATION');
        // AUTH VALIDATION
        if (typeof rule.read === "string") {
          if (rule.read.includes('request.auth.uid')) {
            return validateAuth(rule.read, pathId, req as Request) === true
          }
        }
        // NO VALIDATION
        return rule.read as boolean;
      
      // WRITE
      } else if (rule.write !== null && (req.method === "POST" || req.method === "PUT" || req.method === "DELETE")) {
        console.log('WRITE VALIDATION');    
        // AUTH VALIDATION
        if (typeof rule.write === "string") {
          if (rule.write.includes('request.auth.uid')) {
            return validateAuth(rule.write, pathId, req as Request) === true
          }
        }
        // NO VALIDATION
        return rule.write as boolean;
      }
      throw Error('unimplemented')
    }

    if (pathParam === '/{document=**}') {
      const rule: Rule = rules["/databases/{database}/documents"][pathParam];
      if (rule.read && req.method === "GET") {
        return true;
      } else if (rule.write && (req.method === "POST" || req.method === "PUT" || req.method === "DELETE")) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
};