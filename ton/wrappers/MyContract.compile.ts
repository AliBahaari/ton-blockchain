import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/my_contract.tact',
    options: {
        debug: true,
    },
};
