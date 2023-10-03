import { Principal } from '../candid/types/reference/principal';

/**
 * Returns the caller of the current call
 * @returns the caller of the current call
 */
export function caller(): Principal {
    const callerBytes = globalThis._azleIc.caller();
    return Principal.fromUint8Array(new Uint8Array(callerBytes));
}
