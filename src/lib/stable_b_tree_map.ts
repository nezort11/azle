import { CandidType, TypeMapping } from './candid';
import { None, Opt as AzleOpt, Some } from './candid/types/constructed/opt';
import { Vec as AzleVec } from './candid/types/constructed/vec';
import { nat64 } from './candid/types/primitive/nats/nat64';
import { nat8 } from './candid/types/primitive/nats/nat8';
import { encode, decode } from './candid/serde';
import {
    PipeArrayBuffer as Pipe,
    lebDecode,
    safeRead,
    slebDecode
} from '@dfinity/candid';

export function StableBTreeMap<
    Key extends CandidType,
    Value extends CandidType
>(keyType: Key, valueType: Value, memoryId: nat8) {
    const candidEncodedMemoryId = encode(nat8, memoryId).buffer;

    if ((globalThis as any)._azleIc !== undefined) {
        (globalThis as any)._azleIc.stableBTreeMapInit(candidEncodedMemoryId);
    }

    return {
        /**
         * Checks if the given key exists in the map.
         * @param key the key to check.
         * @returns `true` if the key exists in the map, `false` otherwise.
         */
        containsKey(key: TypeMapping<Key>): boolean {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;
            const candidEncodedKey = encode(keyType, key).buffer;

            return (globalThis as any)._azleIc.stableBTreeMapContainsKey(
                candidEncodedMemoryId,
                candidEncodedKey
            );
        },
        /**
         * Retrieves the value stored at the provided key.
         * @param key the location from which to retrieve.
         * @returns the value associated with the given key, if it exists.
         */
        get(key: TypeMapping<Key>): AzleOpt<TypeMapping<Value>> {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;
            const candidEncodedKey = encode(keyType, key).buffer;

            const candidEncodedValue = (
                globalThis as any
            )._azleIc.stableBTreeMapGet(
                candidEncodedMemoryId,
                candidEncodedKey
            );

            if (candidEncodedValue === undefined) {
                return None;
            } else {
                return Some(decode(valueType, candidEncodedValue));
            }
        },
        /**
         * Inserts a value into the map at the provided key.
         * @param key the location at which to insert.
         * @param value the value to insert.
         * @returns the previous value of the key, if present.
         */
        insert(
            key: TypeMapping<Key>,
            value: TypeMapping<Value>
        ): AzleOpt<TypeMapping<Value>> {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;
            const candidEncodedKey = encode(keyType, key).buffer;
            const candidEncodedValue = encode(valueType, value).buffer;

            const candidEncodedResultValue = (
                globalThis as any
            )._azleIc.stableBTreeMapInsert(
                candidEncodedMemoryId,
                candidEncodedKey,
                candidEncodedValue
            );

            if (candidEncodedResultValue === undefined) {
                return None;
            } else {
                return Some(decode(valueType, candidEncodedResultValue));
            }
        },
        /**
         * Checks if the map is empty.
         * @returns `true` if the map contains no elements, `false` otherwise.
         */
        isEmpty(): boolean {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;

            return (globalThis as any)._azleIc.stableBTreeMapIsEmpty(
                candidEncodedMemoryId
            );
        },
        /**
         * Retrieves the items in the map in sorted order.
         * @returns tuples representing key/value pairs.
         */
        items(): [TypeMapping<Key>, TypeMapping<Value>][] {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;

            const candidEncodedItems = (
                globalThis as any
            )._azleIc.stableBTreeMapItems(candidEncodedMemoryId);

            // TODO too much copying
            return candidEncodedItems.map((candidEncodedItem: any) => {
                return [
                    decode(keyType, candidEncodedItem[0]),
                    decode(valueType, candidEncodedItem[1])
                ];
            });
        },
        /**
         * The keys for each element in the map in sorted order.
         * @returns they keys in the map.
         */
        keys(): TypeMapping<Key>[] {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;

            const candidEncodedKeys = (
                globalThis as any
            )._azleIc.stableBTreeMapKeys(candidEncodedMemoryId);

            // TODO too much copying
            return candidEncodedKeys.map((candidEncodedKey: any) => {
                return decode(keyType, candidEncodedKey);
            });
        },
        /**
         * Checks to see how many elements are in the map.
         * @returns the number of elements in the map.
         */
        len(): nat64 {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;

            const candidEncodedLen = (
                globalThis as any
            )._azleIc.stableBTreeMapLen(candidEncodedMemoryId);

            return decode(nat64, candidEncodedLen);
        },
        /**
         * Removes a key from the map.
         * @param key the location from which to remove.
         * @returns the previous value at the key if it exists, `null` otherwise.
         */
        remove(key: TypeMapping<Key>): AzleOpt<TypeMapping<Value>> {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;
            const candidEncodedKey = encode(keyType, key).buffer;

            const candidEncodedValue = (
                globalThis as any
            )._azleIc.stableBTreeMapRemove(
                candidEncodedMemoryId,
                candidEncodedKey
            );

            if (candidEncodedValue === undefined) {
                return None;
            } else {
                return Some(decode(valueType, candidEncodedValue));
            }
        },
        /**
         * The values in the map in sorted order.
         * @returns the values in the map.
         */
        values(): TypeMapping<Value>[] {
            const candidEncodedMemoryId = encode(nat8, memoryId).buffer;

            const candidEncodedValues = (
                globalThis as any
            )._azleIc.stableBTreeMapValues(candidEncodedMemoryId);

            const candidEncodedArray =
                encodeHardEnoughAndYoullFindYourselfDecoding(
                    valueType,
                    candidEncodedValues
                );

            return decode(
                AzleVec(valueType),
                new Uint8Array(candidEncodedArray)
            );
        }
    };
}

function encodeHardEnoughAndYoullFindYourselfDecoding(
    valueType: any,
    arrayBufferOfEncodedValues: ArrayBuffer[]
) {
    const arrayOfEncodedValues = arrayBufferOfEncodedValues.map(
        (value) => new Uint8Array(value)
    );
    const emptyEncodedArrayOfValues = encode(AzleVec(valueType), []);
    if (arrayOfEncodedValues.length === 0) {
        return emptyEncodedArrayOfValues;
    }
    // TODO we could probably update this one to be just the array without the last element
    const end = getEndOfTypeTable(emptyEncodedArrayOfValues);
    const encodedType = arrayOfEncodedValues[0];
    const endIndex = getEndOfTypeTable(encodedType);
    const encodedArrayOfValues = arrayOfEncodedValues.map((value) => {
        return value.slice(endIndex);
    });
    const fakeBuffer = [...emptyEncodedArrayOfValues.slice(0, end)];
    fakeBuffer.push(encodedArrayOfValues.length);
    encodedArrayOfValues.forEach((value) => {
        for (let i = 0; i < value.length; i++) {
            fakeBuffer.push(value[i]);
        }
    });
    return fakeBuffer;
}

const enum IDLTypeIds {
    Null = -1,
    Bool = -2,
    Nat = -3,
    Int = -4,
    Float32 = -13,
    Float64 = -14,
    Text = -15,
    Reserved = -16,
    Empty = -17,
    Opt = -18,
    Vector = -19,
    Record = -20,
    Variant = -21,
    Func = -22,
    Service = -23,
    Principal = -24
}

const magicNumber = 'DIDL';

/* This function is essentially a clone of the IDL.decode function. With the
Following exceptions:
1. We stop right after the call to the readTypeTable function; we don't care
about the other parts.
2. We get rid of the part that is reconstructing the type table and the types.
We don't actually want to recreate any of that, we just want to figure out how
much space it takes up.
2. Right after the new Pipe() is made we look at the byte length of the pipe
3. Right before we return we measure the byteLength again. This will tell us
how many bytes were read as part of reading the typeTable.
With that start and end value in hand we can easily calculate the end index of
the type table.
*/
function getEndOfTypeTable(bytes: ArrayBuffer): number {
    const b = new Pipe(bytes);
    const start = b.byteLength;

    if (bytes.byteLength < magicNumber.length) {
        throw new Error('Message length smaller than magic number');
    }
    const magicBuffer = safeRead(b, magicNumber.length);
    const magic = new TextDecoder().decode(magicBuffer);
    if (magic !== magicNumber) {
        throw new Error('Wrong magic number: ' + JSON.stringify(magic));
    }

    function readTypeTable(pipe: Pipe): void {
        const len = Number(lebDecode(pipe));

        for (let i = 0; i < len; i++) {
            const ty = Number(slebDecode(pipe));
            switch (ty) {
                case IDLTypeIds.Opt:
                case IDLTypeIds.Vector: {
                    const t = Number(slebDecode(pipe));
                    break;
                }
                case IDLTypeIds.Record:
                case IDLTypeIds.Variant: {
                    let objectLength = Number(lebDecode(pipe));
                    let prevHash;
                    while (objectLength--) {
                        const hash = Number(lebDecode(pipe));
                        if (hash >= Math.pow(2, 32)) {
                            throw new Error('field id out of 32-bit range');
                        }
                        if (typeof prevHash === 'number' && prevHash >= hash) {
                            throw new Error('field id collision or not sorted');
                        }
                        prevHash = hash;
                        const t = Number(slebDecode(pipe));
                    }
                    break;
                }
                case IDLTypeIds.Func: {
                    let argLength = Number(lebDecode(pipe));
                    while (argLength--) {}
                    const returnValues = [];
                    let returnValuesLength = Number(lebDecode(pipe));
                    while (returnValuesLength--) {
                        returnValues.push(Number(slebDecode(pipe)));
                    }
                    let annotationLength = Number(lebDecode(pipe));
                    while (annotationLength--) {
                        const annotation = Number(lebDecode(pipe));
                        switch (annotation) {
                            case 1: {
                                break;
                            }
                            case 2: {
                                break;
                            }
                            case 3: {
                                break;
                            }
                            default:
                                throw new Error('unknown annotation');
                        }
                    }
                    break;
                }
                case IDLTypeIds.Service: {
                    let servLength = Number(lebDecode(pipe));
                    while (servLength--) {
                        const nameLength = Number(lebDecode(pipe));
                        const funcName = new TextDecoder().decode(
                            safeRead(pipe, nameLength)
                        );
                        const funcType = slebDecode(pipe);
                    }
                    break;
                }
                default:
                    throw new Error('Illegal op_code: ' + ty);
            }
        }

        const length = Number(lebDecode(pipe));
        for (let i = 0; i < length; i++) {
            Number(slebDecode(pipe));
        }
        return;
    }
    readTypeTable(b);
    return start - b.byteLength;
}
