import { IDL } from '@dfinity/candid';
import { nat32 } from '../candid/types/primitive/nats/nat32';
import { nat64 } from '../candid/types/primitive/nats/nat64';

/**
 * Gets the value of the specified performance counter
 *
 * @param counterType the type of performance counter to use. Currently `0`
 * (instruction counter) is the only supported type. It returns the number
 * of WebAssembly instructions the system has determined that the canister
 * has executed.
 * @returns the performance counter metric
 */
export function performanceCounter(counterType: nat32): nat64 {
    const counterTypeCandidBytes = new Uint8Array(
        IDL.encode([IDL.Nat32], [counterType])
    ).buffer;

    const performanceCounterCandidBytes = globalThis._azleIc.performanceCounter(
        counterTypeCandidBytes
    );

    return BigInt(
        IDL.decode([IDL.Nat64], performanceCounterCandidBytes)[0] as number
    );
}
