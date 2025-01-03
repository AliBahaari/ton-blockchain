import { toNano } from '@ton/core';
import { MyContract } from '../wrappers/MyContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const myContract = provider.open(await MyContract.fromInit());

    await myContract.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(myContract.address);

    // run methods on `myContract`
}
