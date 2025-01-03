import { getHttpEndpoint } from '@orbs-network/ton-access'
import { mnemonicToWalletKey } from '@ton/crypto'
import { fromNano, internal, TonClient, WalletContractV4 } from '@ton/ton'

async function main() {
  const mnemonic =
    'kiss climb more dance minimum plunge pond degree farm brass title attract enough become crystal major anger primary curve mosquito luxury bring add random'
  const key = await mnemonicToWalletKey(mnemonic.split(' '))
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  })

  const endpoint = await getHttpEndpoint({ network: 'testnet' })
  const client = new TonClient({
    endpoint,
  })

  const balance = await client.getBalance(wallet.address)
  console.log('🚀 ~ main ~ balance:', fromNano(balance))

  const contract = client.open(wallet)
  const seqno = await contract.getSeqno()
  console.log('🚀 ~ main ~ seqno:', seqno)

  // contract.sendTransfer({
  //   secretKey: key.secretKey,
  //   seqno,
  //   messages: [
  //     internal({
  //       to: '',
  //       value: '0.05',
  //       body: 'Hello!',
  //       bounce: false,
  //     }),
  //   ],
  // })
}

main()
