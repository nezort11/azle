import { deploy, run_tests, Test } from 'azle/test';
import { createActor } from '../test/dfx_generated/generators';
import { get_tests } from './tests';

const generators_canister = createActor('rrkah-fqaaa-aaaaa-aaaaq-cai', {
    agentOptions: {
        host: 'http://127.0.0.1:8000'
    }
});

const tests: Test[] = [
    ...deploy('generators'),
    ...get_tests(generators_canister)
];

run_tests(tests);
