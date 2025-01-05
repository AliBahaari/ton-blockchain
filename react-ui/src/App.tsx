import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import { getHttpEndpoint } from '@orbs-network/ton-access'
import { TonClient } from '@ton/ton'
import {
  Address,
  fromNano,
  OpenedContract,
  SenderArguments,
  toNano,
} from '@ton/core'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Donate } from './contracts/Donate'

function App() {
  const [tonConnectUI] = useTonConnectUI()
  const [donateContract, setDonateContract] =
    useState<OpenedContract<Donate> | null>(null)

  const tonConnect = useMemo(() => {
    return {
      sender: {
        send: async (args: SenderArguments) => {
          tonConnectUI.sendTransaction({
            messages: [
              {
                address: args.to.toString(),
                amount: args.value.toString(),
                payload: args.body?.toBoc().toString('base64'),
              },
            ],
            validUntil: Date.now() + 5 * 60 * 1000,
          })
        },
      },
      connected: tonConnectUI.connected,
    }
  }, [tonConnectUI])

  useEffect(() => {
    async function main() {
      const endpoint = await getHttpEndpoint({ network: 'testnet' })
      const client = new TonClient({
        endpoint,
      })
      const contract = new Donate(
        Address.parse('EQD0WCcCAKYk9qzI2tufxGS682qt3sSrbCtxx4RNpZG3s4AO')
      )
      const openedContract = client.open(contract) as OpenedContract<Donate>

      setDonateContract(openedContract)
    }

    main()
  }, [])

  async function handleDonate() {
    if (donateContract) {
      await donateContract.send(
        tonConnect.sender,
        { bounce: true, value: toNano(0.3) },
        { $$type: 'DonateMessage', fullName: 'Ali' }
      )
    }
  }

  const { data = [], isFetching } = useQuery({
    queryKey: ['donors'],
    queryFn: async () => {
      if (donateContract) {
        return (await donateContract.getReturnDonors()).values()
      } else {
        return []
      }
    },
    refetchInterval: 3000,
  })

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-screen">
      <TonConnectButton />

      <button
        className="bg-black text-white px-10 py-2 rounded-md"
        onClick={handleDonate}
      >
        Donate 0.3
      </button>

      {isFetching ? (
        <span>Loading...</span>
      ) : (
        <>
          {data.length > 0 &&
            data.map((i, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <span>{i.fullName}</span>
                <span>-</span>
                <span>{fromNano(i.amount).toString()} TON</span>
              </div>
            ))}
        </>
      )}
    </div>
  )
}

export default App
