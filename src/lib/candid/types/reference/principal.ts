import { IDL } from '@dfinity/candid';
import { Principal as DfinityPrincipal } from '@dfinity/principal';
import { encode } from '../../serde/encode';
import { decode } from '../../serde/decode';

export class Principal extends DfinityPrincipal {
    static _azleCandidType?: '_azleCandidType';

    static toBytes(data: number): Uint8Array {
        return encode(Principal, data);
    }

    static fromBytes(bytes: Uint8Array): number {
        return decode(Principal, bytes);
    }

    static getIdl?() {
        return IDL.Principal;
    }
}
