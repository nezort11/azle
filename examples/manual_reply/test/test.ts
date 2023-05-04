import { getCanisterId, runTests } from 'azle/test';
import { createActor } from './dfx_generated/manual_reply';
import { getTests } from './tests';

const manual_reply_canister = createActor(getCanisterId('manual_reply'), {
    agentOptions: {
        host: 'http://127.0.0.1:8000'
    }
});

runTests(getTests(manual_reply_canister));
