import BigNumber from 'bignumber.js'

export default function (amount, decimals, symbol) {
  return `${new BigNumber(amount).shiftedBy(-decimals).toString()} ${symbol}`
}
