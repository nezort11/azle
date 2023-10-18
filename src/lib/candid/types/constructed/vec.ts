import { CandidType } from '../../index';
import { Parent, toIdl } from '../../index';
import { IDL } from '@dfinity/candid';

export class AzleVec<T> {
    constructor(t: any) {
        this.innerType = t;
    }

    innerType: CandidType;
    _azleCandidType?: '_azleCandidType';

    getIdl(parents: Parent[]) {
        return IDL.Vec(toIdl(this.innerType, parents));
    }
}

export type Vec<T> = T[];
export function Vec<T>(t: T): AzleVec<T> {
    return new AzleVec(t);
}
