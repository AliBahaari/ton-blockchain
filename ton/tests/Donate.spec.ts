import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Donate } from '../wrappers/Donate';
import '@ton/test-utils';

describe('Donate', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let donate: SandboxContract<Donate>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        donate = blockchain.openContract(await Donate.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await donate.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: donate.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and donate are ready to use
    });
});
