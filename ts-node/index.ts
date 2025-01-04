import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import { Address, OpenedContract } from "@ton/core";
import { MyContract } from "./contracts/tact_MyContract";

async function main() {
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({
    endpoint,
  });
  const contract = new MyContract(
    Address.parse("kQDo3VSHrUXKvBru-Na3wfV1kgu52yFljfSmXif5yzF4TGQ9")
  );
  const myContract = client.open(contract) as OpenedContract<MyContract>;

  console.log(await myContract.getReturnDonaters());
  console.log(await myContract.getOwner());
}

main();
