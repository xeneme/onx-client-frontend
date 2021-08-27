const hosts = {
  'mybitfx.com': 'MyBitFX',
  'trade.surf': 'TradeSurf',
  'excryptobit.com': 'ExCryptoBit',
  'feelcryptobit.com': 'FeelCryptoBit',
  'cryptofxtrade.pro': 'CryptoFX',
  'cryptohikes.com': 'CryptoHikes',
}

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match =>
    match.toUpperCase(),
  )

function clearURL(url) {
  return url.replace(/www\./, '').replace(new RegExp('(.\\w+)$', 'g'), '')
}

function URL2Name(url) {
  return clearURL(url)
    .replace(new RegExp('[_-]', 'g'), ' ')
    .split(' ')
    .map(w => capitalize(w))
    .join('')
}

module.exports = {
  getHostCase(raw) {
    let host = hosts[raw]
    return host || URL2Name(raw)
  },
}
