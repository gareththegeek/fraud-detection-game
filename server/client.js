import {Moneyhub} from "@mft/moneyhub-api-client"

const config = {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk/oidc",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "f37cac43-a0ad-4eb3-9b2c-f85618a26a9c",
    client_secret: "201a3e4f-a522-472b-a574-9d40ca4c0524",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "http://localhost:5000/redirect",
    response_type: "code",
    keys: []
  },
}


const getMoneyhubClient = async () => {
  const moneyhub = await Moneyhub(config)
  return moneyhub
}

export {
  getMoneyhubClient
}