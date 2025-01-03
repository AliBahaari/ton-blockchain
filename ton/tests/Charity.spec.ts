import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Charity } from '../wrappers/Charity';
import '@ton/test-utils';

describe('Charity', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let charity: SandboxContract<Charity>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        charity = blockchain.openContract(await Charity.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await charity.send(
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
            to: charity.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and charity are ready to use
    });
});
