import { blob, ic, Query } from 'azle';

export function candid_encode(candid_string: string): Query<blob> {
    return ic.candid_encode(candid_string);
}

export function candid_decode(candid_encoded: blob): Query<string> {
    return ic.candid_decode(candid_encoded);
}
