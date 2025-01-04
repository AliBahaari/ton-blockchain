import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import { Address, OpenedContract, SenderArguments, toNano } from "@ton/core";
import { MyContract } from "./contracts/tact_MyContract";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const [contract, setContract] = useState<OpenedContract<MyContract> | null>(
    null
  );

  const tonConnect = useMemo(() => {
    return {
      sender: {
        send: async (args: SenderArguments) => {
          tonConnectUI.sendTransaction({
            messages: [
              {
                address: args.to.toString(),
                amount: args.value.toString(),
                payload: args.body?.toBoc().toString("base64"),
              },
            ],
            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
          });
        },
      },
      connected: tonConnectUI.connected,
    };
  }, [tonConnectUI]);

  useEffect(() => {
    async function main() {
      const endpoint = await getHttpEndpoint({ network: "testnet" });
      const client = new TonClient({
        endpoint,
      });
      const contract = new MyContract(
        Address.parse("kQDo3VSHrUXKvBru-Na3wfV1kgu52yFljfSmXif5yzF4TGQ9")
      );
      const myContract = client.open(contract) as OpenedContract<MyContract>;

      setContract(myContract);
    }

    main();
  });

  async function handleDonate() {
    if (contract) {
      console.log((await contract.getReturnDonaters()).values());

      await contract.send(
        tonConnect.sender,
        { bounce: true, value: toNano(0.3) },
        { $$type: "DonateMessage", fullName: "Ali" }
      );
    }
  }

  return (
    <div className="flex justify-center">
      <TonConnectButton />
      <button onClick={handleDonate}>Donate</button>
    </div>
  );
}

export default App;
