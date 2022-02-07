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
      ...defaultToken,
      ..._tokenInInfo,
      contractId: _arguments[0].value
    }

    let _tokenOutInfo = tokens.find(
      (t) => t.contractId === _arguments[1].value /** token_b: IAEX9Minimal */
    )
    tokenOut = {
      title: 'To Token',
      ...tokenOut,
      ...defaultToken,
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
      ...defaultToken,
      ..._tokenInInfo,
      contractId: transaction.tx.contractId
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === _arguments[0].value)
    tokenOut = {
      title: 'To Amount',
      ...tokenOut,
      ...defaultToken,
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

/**
 * TODO: Test
 * ref: AedexV2Router.remove_liquidity
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokenIn, tokenOut, sender, recipient, liquidity, deadline }>}
 */
export async function removeLiquidity (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null
  let liquidity = null
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_a_min: int
    tokenIn.amount = _arguments[3].value
    tokenIn.min_amount = _arguments[3].value

    // amount_b_min: int
    tokenOut.min_amount = _arguments[4].value
    tokenOut.amount = _arguments[4].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let _tokenInInfo = tokens.find((t) => t.contractId === _arguments[0].value)
    tokenIn = {
      title: 'From Amount',
      ...tokenIn,
      ...defaultToken,
      ..._tokenInInfo,
      contractId: _arguments[0].value
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === _arguments[1].value)
    tokenOut = {
      title: 'To Amount',
      ...tokenOut,
      ...defaultToken,
      ..._tokenOutInfo,
      contractId: _arguments[1].value
    }

    recipient = _arguments[5].value
    // TODO check (liquidity: int) => _arguments[2].value
    liquidity = _arguments[2].value
    deadline = _arguments[6].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      // tokenIn.amount = _returns[1].value
      // tokenOut.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check removeLiquidity implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient, liquidity, deadline }
}

/**
 * TODO: Test
 * ref: AedexV2Router.remove_liquidity_ae
 * @async
 * @param transaction
 * @param tokens
 * @return {Promise<{ tokenIn, tokenOut, sender, recipient, liquidity, deadline }>}
 */
export async function removeLiquidityAe (transaction, tokens = []) {
  let tokenIn = {}
  let tokenOut = {}
  let sender = null
  let recipient = null
  let liquidity = null
  let deadline = null

  try {
    let _arguments = transaction.tx.arguments
    let _returns = []
    if (transaction.tx.return && transaction.tx.return.type === 'tuple') {
      _returns = transaction.tx.return.value
    }

    // amount_token_min: int
    tokenIn.amount = _arguments[2].value
    tokenIn.min_amount = _arguments[2].value

    // amount_ae_min: int
    tokenOut.min_amount = _arguments[3].value
    tokenOut.amount = _arguments[3].value // to handle when this transaction is been reverted

    // path: list(IAEX9Minimal)
    let _tokenInInfo = tokens.find((t) => t.contractId === _arguments[0].value)
    tokenIn = {
      title: 'From Amount',
      ...tokenIn,
      ...defaultToken,
      ..._tokenInInfo,
      contractId: _arguments[0].value
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === transaction.tx.contractId)
    tokenOut = {
      title: 'To Amount',
      ...tokenOut,
      ...defaultToken,
      ..._tokenOutInfo,
      contractId: transaction.tx.contractId
    }

    // to: address
    recipient = _arguments[4].value
    // TODO check (liquidity: int) => _arguments[2].value
    liquidity = _arguments[1].value
    deadline = _arguments[5].value
    sender = transaction.tx.callerId

    // final results
    if (_returns.length) {
      // tokenIn.amount = _returns[1].value
      // tokenOut.amount = _returns[0].value
    }
  } catch (error) {
    throw Error(`check removeLiquidityAe implementation : `, null, error)
  }

  return { tokenIn, tokenOut, sender, recipient, liquidity, deadline }
}

/**
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
      title: 'From Token',
      ...tokenIn,
      ...defaultToken,
      ..._tokenInInfo
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      title: 'To Token',
      ...tokenOut,
      ...defaultToken,
      ..._tokenOutInfo
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
      title: 'To Token',
      ...tokenOut,
      ...defaultToken,
      ..._tokenOutInfo,
      contractId: contracts[0].value
    }

    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenIn = {
      title: 'From Token',
      ...tokenIn,
      ..._tokenInInfo
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
      title: 'To Token',
      ...tokenOut,
      ...defaultToken,
      ..._tokenOutInfo
    }

    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenIn = {
      title: 'From Token',
      ...tokenIn,
      ...defaultToken,
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
      ...defaultToken,
      ..._tokenOutInfo
    }

    let _tokenInInfo = tokens.find((t) => t.contractId === contracts[0].value)
    tokenIn = {
      title: 'From Token',
      ...tokenIn,
      ...defaultToken,
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
      title: 'From Token',
      ...tokenIn,
      ...defaultToken,
      ..._tokenInInfo,
      contractId: contracts[0].value
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      title: 'To Token',
      ...tokenOut,
      ...defaultToken,
      ..._tokenOutInfo
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
      ...defaultToken,
      ..._tokenInInfo,
      contractId: contracts[0].value
    }

    let _tokenOutInfo = tokens.find((t) => t.contractId === contracts[1].value)
    tokenOut = {
      title: 'To Token',
      ...tokenOut,
      ...defaultToken,
      ..._tokenOutInfo
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

/**
 * TODO:: test
 * ref: AedexV2Pair.create_allowance
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, sender, recipient }>}
 */
export async function createAllowance (transaction, tokens = []) {
  let tokenIn = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments

    sender = transaction.tx.callerId

    // for_account: address
    recipient = _arguments[0].value

    // value: int
    tokenIn.amount = _arguments[1].value

    // path: list(IAEX9Minimal)
    let _tokenInInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    tokenIn = {
      title: 'Amount',
      ...tokenIn,
      ...defaultToken,
      ..._tokenInInfo
    }
  } catch (error) {
    throw Error(`check createAllowance implementation : `, null, error)
  }

  return { tokenIn, sender, recipient }
}

/**
 * ref: AedexV2Pair.change_allowance
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, sender, recipient }>}
 */
export async function changeAllowance (transaction, tokens = []) {
  let tokenIn = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments

    sender = transaction.tx.callerId

    // for_account: address
    recipient = _arguments[0].value

    // value_change: int
    tokenIn.amount = _arguments[1].value

    // path: list(IAEX9Minimal)
    let _tokenInInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    tokenIn = {
      title: 'Amount',
      ...tokenIn,
      ...defaultToken,
      ..._tokenInInfo
    }
  } catch (error) {
    throw Error(`check changeAllowance implementation : `, null, error)
  }

  return { tokenIn, sender, recipient }
}

/**
 * TODO:: test
 * ref: AedexV2Pair.transfer_allowance
 * @param transaction
 * @param tokens
 * @returns {Promise<{ tokenIn, sender, recipient }>}
 */
export async function transferAllowance (transaction, tokens = []) {
  let tokenIn = {}
  let sender = null
  let recipient = null

  try {
    let _arguments = transaction.tx.arguments

    // from_account: address
    sender = _arguments[0].value

    // to_account: address
    recipient = _arguments[1].value

    // value: int
    tokenIn.amount = _arguments[0].value

    // path: list(IAEX9Minimal)
    let _tokenInInfo = tokens.find(
      (t) => t.contractId === transaction.tx.contractId
    )
    tokenIn = {
      title: 'Amount',
      ...tokenIn,
      ...defaultToken,
      ..._tokenInInfo
    }
  } catch (error) {
    throw Error(`check transferAllowance implementation : `, null, error)
  }

  return { tokenIn, sender, recipient }
}
