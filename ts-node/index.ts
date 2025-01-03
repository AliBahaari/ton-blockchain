import { getHttpEndpoint } from '@orbs-network/ton-access'
import { TonClient } from '@ton/ton'
import { Address, OpenedContract } from '@ton/core'
import { MyContract } from './contracts/MyContract'

async function main() {
  const endpoint = await getHttpEndpoint({ network: 'testnet' })
  const client = new TonClient({
    endpoint,
  })
  const contract = new MyContract(
    Address.parse('kQB0E8qSP1qwPiHLy0rpJlT-ZkubA_OnBl-KdNqtsG79ulZn')
  )
  const myContract = client.open(contract) as OpenedContract<MyContract>

  console.log(await myContract.getOwner())
}

main()
