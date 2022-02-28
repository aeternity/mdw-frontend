import BigNumber from 'bignumber.js'

export default function (amount, decimals, symbol) {
  try {
    if (!amount) {
      return `0 ${symbol}`
    }
    return `${new BigNumber(amount).shiftedBy(-decimals).toString()} ${symbol || ''}`
  } catch (error) {
    return null
  }
}
