/**
 * @description gets liquidity from a pair of tokenA*tokenB
 * ref: AedexV2Router.add_liquidity
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokenIn, tokenOut, sender, recipient, minLiquidity }>}
 */
export async function addLiquidity (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null
  let minLiquidity = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_a_desired: int
    tokenIn.amount = _arguments[2].value
    // amount_a_min: int
    tokenIn.min_amount = _arguments[4].value

    // amount_b_desired: int
    tokenOut.amount = _arguments[3].value
    // amount_b_min: int
    tokenOut.min_amount = _arguments[5].value

    let _tokenInInfo = tokens.find(
      (t) => t.contractId === _arguments[0].value /** token_a: IAEX9Minimal */
    )
    tokenIn = {
      title: 'From Token',
      ...tokenIn,
      ..._tokenInInfo,
      contractId: _arguments[0].value
    }

    let _tokenOutInfo = tokens.find(
      (t) => t.contractId === _arguments[1].value /** token_b: IAEX9Minimal */
    )
    tokenOut = {
      title: 'To Token',
      ...tokenOut,
      ..._tokenOutInfo,
      contractId: _arguments[1].value
    }

    // to: address
    recipient = _arguments[6].value
    // min_liquidity: int
    minLiquidity = _arguments[7].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenIn.amount = _returns[0].value
      tokenOut.amount = _returns[1].value
      minLiquidity = _returns[2].value
    }
  } catch (error) {
    throw Error(`check addLiquidity implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient, minLiquidity }
}

/**
 * @description gets liquidity from a pair of token*wae
 * ref: AedexV2Router.add_liquidity_ae
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokenIn, tokenOut, sender, recipient, minLiquidity, deadline }>}
 */
export async function addLiquidityAe (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null
  let minLiquidity = null
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_ae_min: int
    tokenIn.amount = transaction.tx.amount
    tokenIn.min_amount = _arguments[3].value

    // amount_out_min: int
    tokenOut.min_amount = _arguments[2].value
    tokenOut.amount = _arguments[1].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let _tokenInInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    tokenIn = {
      title: 'From Amount',
      ...tokenIn,
      decimals: 18,
      name: 'AE',
      symbol: 'AE',
      ..._tokenInInfo,
      contractId: transaction.tx.contractId
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === _arguments[0].value)
    tokenOut = {
      title: 'To Amount',
      ...tokenOut,
      ..._tokenOutInfo,
      contractId: _arguments[0].value
    }

    recipient = _arguments[4].value
    minLiquidity = _arguments[5].value
    deadline = _arguments[6].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenIn.amount = _returns[1].value
      tokenOut.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check addLiquidityAe implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient, minLiquidity, deadline }
}
// todo
export async function removeLiquidity (transaction, tokens = []) {}
// todo
export async function removeLiquidityAe (transaction, tokens = []) {}

/**
 * TODO test
 * ref: AedexV2Router.swap_exact_tokens_for_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, tokenOut, sender, recipient }>}
 */
export async function swapExactTokensForTokens (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_in: int
    tokenIn.amount = _arguments[0].value

    // amount_out_min: int
    tokenOut.min_amount = _arguments[1].value
    tokenOut.amount = _arguments[1].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenIn = {
      ...tokenIn,
      ..._tokenInInfo,
      contractId: contracts[0].value
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      ...tokenOut,
      ..._tokenOutInfo,
      contractId: contracts[1].value
    }

    recipient = _arguments[3].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenIn.amount = _returns[0].value
      tokenOut.amount = _returns[1].value
    }
  } catch (error) {
    throw Error(`check swapExactTokensForTokens implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient }
}

/**
 * TODO test
 * ref: AedexV2Router.swap_tokens_for_exact_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, tokenOut, sender, recipient }>}
 */
export async function swapTokensForExactTokens (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_out: int
    tokenOut.amount = _arguments[0].value

    // amount_in_max: int
    tokenIn.max_amount = _arguments[1].value
    tokenIn.amount = _arguments[1].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenOut = {
      ...tokenOut,
      ..._tokenOutInfo,
      contractId: contracts[0].value
    }

    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenIn = {
      ...tokenIn,
      ..._tokenInInfo,
      contractId: contracts[1].value
    }

    recipient = _arguments[3].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenOut.amount = _returns[0].value
      tokenIn.amount = _returns[1].value
    }
  } catch (error) {
    throw Error(`check swapTokensForExactTokens implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient }
}

/**
 * ref: AedexV2Router.swap_exact_ae_for_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, tokenOut, sender, recipient }>}
 */
export async function swapExactAeForTokens (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    tokenIn.amount = transaction.tx.amount

    // amount_out_min: int
    tokenOut.min_amount = _arguments[0].value
    tokenOut.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[1].value
    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      ...tokenOut,
      ..._tokenOutInfo,
      contractId: contracts[1].value
    }

    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenIn = {
      ...tokenIn,
      decimals: 18,
      name: 'AE',
      symbol: 'AE',
      ..._tokenInInfo,
      contractId: contracts[0].value
    }

    recipient = _arguments[2].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenOut.amount = _returns[1].value
      tokenIn.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check swapExactAeForTokens implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient }
}

/**
 * ref: AedexV2Router.swap_tokens_for_exact_ae
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, tokenOut, sender, recipient }>}
 */
export async function swapTokensForExactAe (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_in_max: int
    tokenIn.amount = _arguments[1].value
    tokenIn.max_amount = _arguments[1].value

    // amount_out_min: int
    tokenOut.min_amount = _arguments[0].value
    tokenOut.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      title: 'To Token',
      ...tokenOut,
      decimals: 18,
      name: 'AE',
      symbol: 'AE',
      ..._tokenOutInfo,
      contractId: contracts[1].value
    }

    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenIn = {
      title: 'From Token',
      ...tokenIn,
      ..._tokenInInfo,
      contractId: contracts[0].value
    }

    recipient = _arguments[2].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenOut.amount = _returns[1].value
      tokenIn.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check swapTokensForExactAe implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient }
}

/**
 * ref: AedexV2Router.swap_exact_tokens_for_ae
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, tokenOut, sender, recipient, deadline }>}
 */
export async function swapExactTokensForAe (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    // amount_out: int
    tokenOut.max_amount = _arguments[1].value
    tokenOut.amount = _arguments[1].value

    // amount_in_max: int
    tokenIn.min_amount = _arguments[0].value
    tokenIn.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[2].value
    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenIn = {
      ...tokenIn,
      ..._tokenInInfo,
      contractId: contracts[0].value
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      ...tokenOut,
      decimals: 18,
      name: 'AE',
      symbol: 'AE',
      ..._tokenOutInfo,
      contractId: contracts[1].value
    }

    recipient = _arguments[3].value
    deadline = _arguments[4].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenIn.amount = _returns[0].value
      tokenOut.amount = _returns[1].value
    }
  } catch (error) {
    throw Error(`check swapTokensForExactAe implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient, deadline }
}

/**
 * ref: AedexV2Router.swap_ae_for_exact_tokens
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, tokenOut, sender, recipient, deadline }>}
 */
export async function swapAeForExactTokens (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'list') {
      _returns = transaction.tx.return.value
    }

    tokenIn.amount = transaction.tx.amount

    // amount_out: int
    tokenOut.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let contracts = _arguments[1].value
    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenIn = {
      title: 'From Token',
      ...tokenIn,
      decimals: 18,
      name: 'AE',
      symbol: 'AE',
      ..._tokenInInfo,
      contractId: contracts[0].value
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      title: 'To Token',
      ...tokenOut,

      ..._tokenOutInfo,
      contractId: contracts[1].value
    }

    recipient = _arguments[2].value
    deadline = _arguments[3].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      tokenOut.amount = _returns[1].value
      tokenIn.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check swapAeForExactTokens implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient, deadline }
}
