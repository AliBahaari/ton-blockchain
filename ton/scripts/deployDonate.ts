import { toNano } from '@ton/core';
import { Donate } from '../wrappers/Donate';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const donate = provider.open(await Donate.fromInit());

    await donate.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(donate.address);

    // run methods on `donate`
}
