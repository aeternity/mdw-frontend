import BigNumber from 'bignumber.js'

export default function (amount, decimals, symbol) {
  if (!amount) {
    return `0 ${symbol}`
  }
  return `${new BigNumber(amount).shiftedBy(-decimals).toString()} ${symbol}`
}
