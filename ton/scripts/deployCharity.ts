import { toNano } from '@ton/core';
import { Charity } from '../wrappers/Charity';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const charity = provider.open(await Charity.fromInit());

    await charity.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(charity.address);

    // run methods on `charity`
}
