const defaultToken = {
  decimals: 18,
  name: 'AE',
  symbol: 'AE'
}

/**
 * @description gets liquidity from a pair of tokenA*tokenB
 * ref: AedexV2Router.add_liquidity
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokens: [tokenA, tokenB, poolToken] }>}
 */
export async function addLiquidity (transaction, tokens = []) {
  let tokenA = {}
  let tokenB = {}
  let poolToken = {}

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_a_desired: int
    tokenA.amount = _arguments[2].value
    // amount_a_min: int
    tokenA.min_amount = _arguments[4].value

    // amount_b_desired: int
    tokenB.amount = _arguments[3].value
    // amount_b_min: int
    tokenB.min_amount = _arguments[5].value

    let _tokenAInfo = tokens.find(
      (t) => t.contractId === _arguments[0].value /** token_a: IAEX9Minimal */
    )
    tokenA = {
      title: 'Token A',
      ...tokenA,
      ...defaultToken,
      ..._tokenAInfo,
      contractId: _arguments[0].value
    }

    let _tokenBInfo = tokens.find(
      (t) => t.contractId === _arguments[1].value /** token_b: IAEX9Minimal */
    )
    tokenB = {
      title: 'Token B',
      ...tokenB,
      ...defaultToken,
      ..._tokenBInfo,
      contractId: _arguments[1].value
    }

    poolToken = {
      title: 'Pool Token',
      ...poolToken,
      amount: _arguments[7].value, // min_liquidity: int
      decimals: 18
    }

    // final results
    if (_returns.length) {
      tokenA.amount = _returns[0].value
      tokenB.amount = _returns[1].value
      poolToken.amount = _returns[2].value
    }
  } catch (error) {
    throw Error(`check addLiquidity implementation : `, null, error)
  }

  return { tokens: [tokenA, tokenB, poolToken] }
}

/**
 * @description gets liquidity from a pair of token*wae
 * ref: AedexV2Router.add_liquidity_ae
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokenA, tokenB, poolToken, deadline }>}
 */
export async function addLiquidityAe (transaction, tokens = []) {
  let tokenA = {}
  let tokenB = {}
  let poolToken = {}
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_ae_min: int
    tokenA.amount = transaction.tx.amount
    tokenA.min_amount = _arguments[3].value

    // amount_out_min: int
    tokenB.min_amount = _arguments[2].value
    tokenB.amount = _arguments[1].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let _tokenAInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    tokenA = {
      title: 'Token A',
      ...tokenA,
      ...defaultToken,
      ..._tokenAInfo,
      contractId: transaction.tx.contractId
    }

    let _tokenBInfo = tokens.find((t) => t.contractId === _arguments[0].value)
    tokenB = {
      title: 'Token B',
      ...tokenB,
      ...defaultToken,
      ..._tokenBInfo,
      contractId: _arguments[0].value
    }

    poolToken = {
      title: 'Pool Token',
      ...poolToken,
      amount: _arguments[5].value,
      decimals: 18
    }

    deadline = _arguments[6].value

    // final results
    if (_returns.length) {
      poolToken.amount = _returns[2].value
      tokenA.amount = _returns[1].value
      tokenB.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check addLiquidityAe implementation : `, null, error)
  }

  return { tokens: [ tokenA, tokenB, poolToken ], deadline }
}

/**
 * ref: AedexV2Router.remove_liquidity
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokens: [tokenA, tokenB, poolToken], deadline }>}
 */
export async function removeLiquidity (transaction, tokens = []) {
  let tokenA = {}
  let tokenB = {}
  let poolToken = {}
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_a_min: int
    tokenA.amount = _arguments[3].value
    tokenA.min_amount = _arguments[3].value

    // amount_b_min: int
    tokenB.min_amount = _arguments[4].value
    tokenB.amount = _arguments[4].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let _tokenAInfo = tokens.find((t) => t.contractId === _arguments[0].value)
    tokenA = {
      title: 'Token A',
      ...tokenA,
      ...defaultToken,
      ..._tokenAInfo,
      contractId: _arguments[0].value
    }

    let _tokenBInfo = tokens.find((t) => t.contractId === _arguments[1].value)
    tokenB = {
      title: 'Token B',
      ...tokenB,
      ...defaultToken,
      ..._tokenBInfo,
      contractId: _arguments[1].value
    }

    poolToken = {
      title: 'Pool Token',
      ...poolToken,
      amount: _arguments[2].value,
      decimals: 18
    }
    deadline = _arguments[6].value

    // final results
    if (_returns.length) {
      tokenA.amount = _returns[1].value
      tokenB.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check removeLiquidity implementation : `, null, error)
  }

  return { tokens: [tokenA, tokenB, poolToken], deadline }
}

/**
 * ref: AedexV2Router.remove_liquidity_ae
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokens: [tokenA, tokenB, poolToken], deadline }>}
 */
export async function removeLiquidityAe (transaction, tokens = []) {
  let tokenA = {}
  let tokenB = {}
  let poolToken = {}
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_token_min: int
    tokenA.amount = _arguments[2].value
    tokenA.min_amount = _arguments[2].value

    // amount_ae_min: int
    tokenB.min_amount = _arguments[3].value
    tokenB.amount = _arguments[3].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let _tokenAInfo = tokens.find((t) => t.contractId === _arguments[0].value)
    tokenA = {
      title: 'Token A',
      ...tokenA,
      ...defaultToken,
      ..._tokenAInfo,
      contractId: _arguments[0].value
    }

    let _tokenBInfo = tokens.find((t) => t.contractId === transaction.tx.contractId)
    tokenB = {
      title: 'Token B',
      ...tokenB,
      ...defaultToken,
      ..._tokenBInfo,
      contractId: transaction.tx.contractId
    }

    poolToken = {
      title: 'Pool Token',
      ...poolToken,
      amount: _arguments[1].value,
      decimals: 18
    }

    deadline = _arguments[5].value

    // final results
    if (_returns.length) {
      tokenA.amount = _returns[1].value
      tokenB.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check removeLiquidityAe implementation : `, null, error)
  }

  return { tokens: [tokenA, tokenB, poolToken], deadline }
}

/**
 * ref: AedexV2Router.swap_exact_tokens_for_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [fromToken, toToken] }>}
 */
export async function swapExactTokensForTokens (transaction, tokens = []) {
  let fromToken = {}
  let toToken = {}

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_in: int
    fromToken.amount = _arguments[0].value

    // amount_out_min: int
    toToken.min_amount = _arguments[1].value
    toToken.amount = _arguments[1].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _fromTokenInfo = tokens.find((t) => t.contractId === contracts[0].value)
    fromToken = {
      title: 'From Token',
      ...fromToken,
      ...defaultToken,
      ..._fromTokenInfo
    }

    let _toTokenInfo = tokens.find((t) => t.contractId === contracts[1].value)
    toToken = {
      title: 'To Token',
      ...toToken,
      ...defaultToken,
      ..._toTokenInfo
    }

    // final results
    if (_returns.length) {
      fromToken.amount = _returns[0].value
      toToken.amount = _returns[1].value
    }
  } catch (error) {
    throw Error(`check swapExactTokensForTokens implementation : `, null, error)
  }

  return { tokens: [fromToken, toToken] }
}

/**
 * ref: AedexV2Router.swap_tokens_for_exact_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [fromToken, toToken] }>}
 */
export async function swapTokensForExactTokens (transaction, tokens = []) {
  let fromToken = {}
  let toToken = {}

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_out: int
    toToken.amount = _arguments[0].value

    // amount_in_max: int
    fromToken.max_amount = _arguments[1].value
    fromToken.amount = _arguments[1].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _toTokenInfo = tokens.find((t) => t.contractId === contracts[0].value)
    toToken = {
      title: 'To Token',
      ...toToken,
      ...defaultToken,
      ..._toTokenInfo,
      contractId: contracts[0].value
    }

    let _fromTokenInfo = tokens.find((t) => t.contractId === contracts[1].value)
    fromToken = {
      title: 'From Token',
      ...fromToken,
      ..._fromTokenInfo
    }

    // final results
    if (_returns.length) {
      toToken.amount = _returns[0].value
      fromToken.amount = _returns[1].value
    }
  } catch (error) {
    throw Error(`check swapTokensForExactTokens implementation : `, null, error)
  }

  return { tokens: [fromToken, toToken] }
}

/**
 * ref: AedexV2Router.swap_exact_ae_for_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [fromToken, toToken] }>}
 */
export async function swapExactAeForTokens (transaction, tokens = []) {
  let fromToken = {}
  let toToken = {}

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    fromToken.amount = transaction.tx.amount

    // amount_out_min: int
    toToken.min_amount = _arguments[0].value
    toToken.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[1].value
    let _toTokenInfo = tokens.find((t) => t.contractId === contracts[1].value)
    toToken = {
      title: 'To Token',
      ...toToken,
      ...defaultToken,
      ..._toTokenInfo
    }

    let _fromTokenInfo = tokens.find((t) => t.contractId === contracts[0].value)
    fromToken = {
      title: 'From Token',
      ...fromToken,
      ...defaultToken,
      ..._fromTokenInfo,
      contractId: contracts[0].value
    }

    // final results
    if (_returns.length) {
      toToken.amount = _returns[1].value
      fromToken.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check swapExactAeForTokens implementation : `, null, error)
  }

  return { tokens: [fromToken, toToken] }
}

/**
 * ref: AedexV2Router.swap_tokens_for_exact_ae
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [fromToken, toToken] }>}
 */
export async function swapTokensForExactAe (transaction, tokens = []) {
  let fromToken = {}
  let toToken = {}

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_in_max: int
    fromToken.amount = _arguments[1].value
    fromToken.max_amount = _arguments[1].value

    // amount_out_min: int
    toToken.min_amount = _arguments[0].value
    toToken.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _toTokenInfo = tokens.find((t) => t.contractId === contracts[1].value)
    toToken = {
      title: 'To Token',
      ...toToken,
      ...defaultToken,
      ..._toTokenInfo
    }

    let _fromTokenInfo = tokens.find((t) => t.contractId === contracts[0].value)
    fromToken = {
      title: 'Fom Token',
      ...fromToken,
      ...defaultToken,
      ..._fromTokenInfo,
      contractId: contracts[0].value
    }

    // final results
    if (_returns.length) {
      toToken.amount = _returns[1].value
      fromToken.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check swapTokensForExactAe implementation : `, null, error)
  }

  return { tokens: [fromToken, toToken] }
}

/**
 * ref: AedexV2Router.swap_exact_tokens_for_ae
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [fromToken, toToken], deadline }>}
 */
export async function swapExactTokensForAe (transaction, tokens = []) {
  let fromToken = {}
  let toToken = {}
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_out: int
    toToken.max_amount = _arguments[1].value
    toToken.amount = _arguments[1].value

    // amount_in_max: int
    fromToken.min_amount = _arguments[0].value
    fromToken.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _fromTokenInfo = tokens.find((t) => t.contractId === contracts[0].value)
    fromToken = {
      title: 'From Token',
      ...fromToken,
      ...defaultToken,
      ..._fromTokenInfo,
      contractId: contracts[0].value
    }

    let _toTokenInfo = tokens.find((t) => t.contractId === contracts[1].value)
    toToken = {
      title: 'To Token',
      ...toToken,
      ...defaultToken,
      ..._toTokenInfo
    }

    deadline = _arguments[4].value

    // final results
    if (_returns.length) {
      fromToken.amount = _returns[0].value
      toToken.amount = _returns[1].value
    }
  } catch (error) {
    throw Error(`check swapTokensForExactAe implementation : `, null, error)
  }

  return { tokens: [fromToken, toToken], deadline }
}

/**
 * ref: AedexV2Router.swap_ae_for_exact_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [fromToken, toToken], deadline }>}
 */
export async function swapAeForExactTokens (transaction, tokens = []) {
  let fromToken = {}
  let toToken = {}
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    fromToken.amount = transaction.tx.amount

    // amount_out: int
    toToken.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[1].value
    let _fromTokenInfo = tokens.find((t) => t.contractId === contracts[0].value)
    fromToken = {
      title: 'From Token',
      ...fromToken,
      ...defaultToken,
      ..._fromTokenInfo,
      contractId: contracts[0].value
    }

    let _toTokenInfo = tokens.find((t) => t.contractId === contracts[1].value)
    toToken = {
      title: 'To Token',
      ...toToken,
      ...defaultToken,
      ..._toTokenInfo
    }

    deadline = _arguments[3].value

    // final results
    if (_returns.length) {
      toToken.amount = _returns[1].value
      fromToken.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check swapAeForExactTokens implementation : `, null, error)
  }

  return { tokens: [fromToken, toToken], deadline }
}

/**
 * ref: AedexV2Pair.create_allowance
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [token], recipient }>}
 */
export async function createAllowance (transaction, tokens = []) {
  let token = {}
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments

    // for_account: address
    recipient = _arguments[0].value

    // value: int
    token.amount = _arguments[1].value

    // path: list(IAEX9Minimal)
    let _tokenInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    token = {
      title: 'Amount',
      ...token,
      ...defaultToken,
      ..._tokenInfo
    }
  } catch (error) {
    throw Error(`check createAllowance implementation : `, null, error)
  }

  return { tokens: [token], recipient }
}

/**
 * ref: AedexV2Pair.change_allowance
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [tokenIn], recipient }>}
 */
export async function changeAllowance (transaction, tokens = []) {
  let token = {}
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments

    // for_account: address
    recipient = _arguments[0].value

    // value_change: int
    token.amount = _arguments[1].value

    // path: list(IAEX9Minimal)
    let _tokenInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    token = {
      title: 'Amount',
      ...token,
      ...defaultToken,
      ..._tokenInfo
    }
  } catch (error) {
    throw Error(`check changeAllowance implementation : `, null, error)
  }

  return { tokens: [token], recipient }
}

/**
 * ref: AedexV2Pair.transfer_allowance
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokens: [token], sender, recipient }>}
 */
export async function transferAllowance (transaction, tokens = []) {
  let token = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments

    // from_account: address
    sender = _arguments[0].value

    // to_account: address
    recipient = _arguments[1].value

    // value: int
    token.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let _tokenInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    token = {
      title: 'Amount',
      ...token,
      ...defaultToken,
      ..._tokenInfo
    }
  } catch (error) {
    throw Error(`check transferAllowance implementation : `, null, error)
  }

  return { tokens: [token], sender, recipient }
}
