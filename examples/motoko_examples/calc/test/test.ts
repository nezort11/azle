import { getCanisterId, runTests } from 'azle/test';
import { createActor } from './dfx_generated/calc';
import { getTests } from './tests';

const calcCanister = createActor(getCanisterId('calc'), {
    agentOptions: {
        host: 'http://127.0.0.1:8000'
    }
});

runTests(getTests(calcCanister));
