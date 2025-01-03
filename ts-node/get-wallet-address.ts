import { mnemonicToWalletKey } from '@ton/crypto'
import { WalletContractV4 } from '@ton/ton'

async function main() {
  const mnemonic =
    'kiss climb more dance minimum plunge pond degree farm brass title attract enough become crystal major anger primary curve mosquito luxury bring add random'
  const key = await mnemonicToWalletKey(mnemonic.split(' '))
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  })

  console.log(wallet.address.toString({ testOnly: true }))
  console.log(wallet.address.workChain)
}

main()
