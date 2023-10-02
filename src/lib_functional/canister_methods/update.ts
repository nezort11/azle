import { isAsync } from '../utils';
import {
    Callback,
    CanisterMethodInfo,
    MethodArgs,
    createParents,
    executeMethod
} from '.';
import { CandidType, TypeMapping } from '../candid';
import { toParamIDLTypes, toReturnIDLType } from '../utils';

export function update<
    const Params extends ReadonlyArray<CandidType>,
    Return extends CandidType,
    GenericCallback extends Callback<Params, Return>
>(
    paramsIdls: Params,
    returnIdl: Return,
    callback?: Awaited<ReturnType<GenericCallback>> extends TypeMapping<Return>
        ? GenericCallback
        : never,
    methodArgs?: MethodArgs
): CanisterMethodInfo<Params, Return> {
    return (parent: any) => {
        const parents = createParents(parent);
        const paramCandid = toParamIDLTypes(paramsIdls as any, parents);
        const returnCandid = toReturnIDLType(returnIdl as any, parents);

        const finalCallback =
            callback === undefined
                ? undefined
                : (...args: any[]) => {
                      executeMethod(
                          'update',
                          paramCandid,
                          returnCandid,
                          args,
                          callback,
                          paramsIdls as any,
                          returnIdl,
                          methodArgs?.manual ?? false
                      );
                  };

        return {
            mode: 'update',
            callback: finalCallback,
            paramsIdls: paramsIdls as any,
            returnIdl,
            async: callback === undefined ? false : isAsync(callback),
            guard: methodArgs?.guard
        };
    };
}
