import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MyContract } from '../wrappers/MyContract';
import '@ton/test-utils';

describe('MyContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let myContract: SandboxContract<MyContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        myContract = blockchain.openContract(await MyContract.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await myContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: myContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and myContract are ready to use
    });
});
