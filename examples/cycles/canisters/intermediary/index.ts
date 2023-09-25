import {
    ic,
    init,
    nat,
    nat64,
    Principal,
    query,
    Service,
    update,
    Void
} from 'azle';
import Cycles from '../cycles';

let cyclesCanister: typeof Cycles;

export default Service({
    init: init([], () => {
        cyclesCanister = Cycles(
            Principal.fromText(
                process.env.CYCLES_PRINCIPAL ??
                    ic.trap('process.env.CYCLES_PRINCIPAL is undefined')
            )
        );
    }),
    // Reports the number of cycles returned from the Cycles canister
    sendCycles: update([], nat64, async () => {
        return await ic.call(cyclesCanister.receiveCycles, {
            cycles: 1_000_000n
        });
    }),
    sendCyclesNotify: update([], Void, () => {
        return ic.notify(cyclesCanister.receiveCycles, {
            cycles: 1_000_000n
        });
    }),
    // Reports the number of cycles returned from the Cycles canister
    sendCycles128: update([], nat, async () => {
        await ic.call(cyclesCanister.receiveCycles128, {
            cycles: 1_000_000n
        });

        return ic.msgCyclesRefunded128();
    }),
    sendCycles128Notify: update([], Void, () => {
        return ic.notify(cyclesCanister.receiveCycles128, {
            cycles: 1_000_000n
        });
    }),
    getCanisterBalance: query([], nat64, () => {
        return ic.canisterBalance();
    }),
    getCanisterBalance128: query([], nat, () => {
        return ic.canisterBalance128();
    })
});
