import { Encoder } from '@aeternity/aepp-calldata'
import camelcaseKeysDeep from 'camelcase-keys-deep'
import Swagger from '@aeternity/aepp-sdk/es/utils/swagger'
import swag from './../../swagger.json'

export const initMiddleware = (state) => {
  swag.paths = {
    ...swag.paths,
    '/name/auction/{name}': {
      get: {
        operationId: 'getAuctionInfoByName',
        parameters: [
          {
            in: 'path',
            name: 'name',
            required: true,
            type: 'string'
          }
        ]
      }
    },
    '/txs/backward': {
      get: {
        operationId: 'getTxBackward',
        parameters: [
          {
            in: 'query',
            name: 'type',
            required: false,
            type: 'string'
          },
          {
            in: 'query',
            name: 'type_group',
            required: false,
            type: 'string'
          },
          {
            in: 'query',
            name: 'account',
            required: false,
            type: 'string'
          },
          {
            in: 'query',
            name: 'limit',
            required: false,
            type: 'integer'
          },
          {
            in: 'query',
            name: 'page',
            required: false,
            type: 'integer'
          },
          {
            in: 'query',
            name: 'contract',
            required: false,
            type: 'string'
          }
        ]
      }
    },
    '/blocks/backward': {
      get: {
        operationId: 'getGenerationsBackward'
      }
    }
  }

  const swg = Swagger.compose({
    methods: {
      urlFor: (path) => `${state.middlewareURL}${path}`,
      axiosError: () => ''
    }
  })({ swag })
  swg.Swagger = { defaults: {} }

  return camelcaseKeysDeep(swg.api)
}

export const fetchMiddleware = async (path, url = '') => {
  // don't prefix with url if `path` is absolute
  const uri = path.indexOf('http') === 0 ? `${path}` : `${url}${path}`
  const json = camelcaseKeysDeep(await fetchJson(uri))
  // some endpoints return array
  if (Array.isArray(json)) return json

  // result is paginated
  return { data: {}, next: null, ...json }
}

export const fetchNode = async (path, url = '') => {
  //  don't prefix with url if `path` is absolute
  const uri = path.indexOf('http') === 0 ? `${path}` : `${url}${path}`

  return camelcaseKeysDeep(await fetchJson(uri))
}

// replacement for lodash times function in vanilla ES5
export const times = (count, func) => {
  let i = 0
  let per
  let results = []
  count = count || 0
  func = func || function () { }

  // while i is less than len
  while (i < count) {
    per = i / count

    // call function with a custom api that can be
    // used via the this keyword
    results.push(func.call({
      i: i,
      count: count,
      per: per,
      bias: 1 - Math.abs(0.5 - per) / 0.5,
      results: results
    }, i, count, per))
    i += 1
  }
  return results
}

export const transformMetaTx = (txDetails) => {
  return {
    blockHeight: txDetails.blockHeight,
    blockHash: txDetails.blockHash,
    gas: txDetails.tx.gas,
    hash: txDetails.hash,
    ga_id: txDetails.tx.ga_id,
    gasPrice: txDetails.tx.gasPrice,
    fee: txDetails.tx.fee,
    abiVersion: txDetails.tx.abiVersion,
    auth_data: txDetails.tx.auth_data,
    tx: txDetails.tx.tx.tx
  }
}

export const transformTxType = (transaction) => {
  let txType = transaction.tx.type.replace(/([A-Z])/g, ' $1')
  if (transaction.ga_id) {
    txType += ' (GA)'
  }
  return txType
}

export const fixContractCreateTx = (c) => {
  if (c.tx.type !== 'ContractCallTx') {
    return c
  }

  let _return = {
    type: 'bool',
    value: c.tx.returnType === 'ok' ? 'true' : 'false'
  }
  if (c.tx.returnType === 'revert' && c.tx.returnValue && c.tx.returnValue.includes('cb_')) {
    const encoder = new Encoder()

    _return = {
      type: 'message',
      value: encoder.decodeFateString(c.tx.returnValue)
    }
  }

  return {
    ...c,
    tx: {
      function: 'init',
      arguments: c.tx.args ?? [],
      result: c.tx.returnType,
      return: _return,
      ...c.tx
    }
  }
}

export const fetchJson = async (...args) => {
  const response = await fetch(...args)
  return response.json()
}
