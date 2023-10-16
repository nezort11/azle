import {
    CandidType,
    Canister,
    Func as AzleFunc,
    Null as AzleNull,
    Principal as AzlePrincipal,
    Record as AzleRecord,
    Tuple as AzleTuple,
    TypeMapping,
    Variant as AzleVariant,
    Void,
    bool,
    empty,
    float32,
    float64,
    int,
    int16,
    int32,
    int64,
    int8,
    nat,
    nat16,
    nat32,
    text,
    toIDLType
} from './candid';
import { None, Opt as AzleOpt, Some } from './candid/types/constructed/opt';
import { Vec as AzleVec } from './candid/types/constructed/vec';
import { nat64 } from './candid/types/primitive/nats/nat64';
import { nat8 } from './candid/types/primitive/nats/nat8';
import { encode, decode } from './candid/serde';
import { query } from './canister_methods';
import {
    IDL,
    JsonValue,
    PipeArrayBuffer as Pipe,
    lebDecode,
    safeRead,
    slebDecode
} from '@dfinity/candid';
import {
    Bool,
    Nat,
    Rec,
    RecClass,
    Type,
    Null as IDLNull,
    Int,
    Nat8,
    Nat16,
    Nat32,
    Nat64,
    Int8,
    Int16,
    Int32,
    Int64,
    Float32,
    Float64,
    Text as IDLText,
    Reserved,
    Empty,
    Principal as IDLPrincipal,
    Vec,
    Opt,
    Record,
    Tuple,
    Variant,
    Func,
    FuncClass,
    Service
} from '@dfinity/candid/lib/cjs/idl';

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

            // return decode(Vec(valueType), candidEncodedValues);
            console.log(
                '//Array of Encoded values (to be converted to encoded array of values)'
            );
            // console.log(
            //     JSON.stringify(
            //         candidEncodedValues.map((value: ArrayBuffer) => [
            //             ...new Uint8Array(value)
            //         ])
            //     )
            // );

            // TODO too much copying
            const result = candidEncodedValues.map(
                (candidEncodedValue: any) => {
                    return decode(valueType, candidEncodedValue);
                }
            );

            // examineResult(result, valueType);
            // const newResult = fakeItTillYouMakeIt(candidEncodedValues);
            // console.log('// RESULT of fake it till you make it:');
            // console.log(JSON.stringify(newResult));
            // console.log(decode(AzleVec(valueType), new Uint8Array(newResult)));
            const newerResult = encodeHardEnoughAndYoullFindYourselfDecoding(
                valueType,
                candidEncodedValues
            );
            playWith11Records();
            console.log('//BEFORE: This is the result we got');
            console.log(JSON.stringify(candidEncodedValues, customReplacer));
            console.log(candidEncodedValues);
            console.log('// GOAL: this is what we want to get');
            pe(AzleVec(valueType), result);
            console.log('// RESULT: of encode hard enough:');
            console.log(JSON.stringify(newerResult, customReplacer));
            // examineVariousVecs();
            // examineSimpleTypes();
            // examineMultipleEncodedValues();
            // examineComplexity();
            // playWithSleb();

            return decode(AzleVec(valueType), new Uint8Array(newerResult));
        }
    };
}

function customReplacer(key, value) {
    if (typeof value === 'bigint') {
        return value.toString(); // Convert BigInt to its string representation
    }
    return value; // Return other values as is
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
    console.log('HERE IS THE EMPTY ENCODING');
    console.log(emptyEncodedArrayOfValues);
    const [start, end] = getEndOfTypeTable(emptyEncodedArrayOfValues);
    console.log(`We have determined the end of the type table to be ${end}`);
    const encodedType = arrayOfEncodedValues[0];
    const [startIndex, endIndex] = getEndOfTypeTable(encodedType);
    const encodedArrayOfValues = arrayOfEncodedValues.map((value) => {
        return value.slice(endIndex);
    });
    const fakeBuffer = [...emptyEncodedArrayOfValues.slice(0, end)];
    console.log(
        'Consequently our fake buffer looks like this at the beginning'
    );
    console.log(JSON.stringify(fakeBuffer, customReplacer));
    fakeBuffer.push(encodedArrayOfValues.length);
    encodedArrayOfValues.forEach((value) => {
        for (let i = 0; i < value.length; i++) {
            fakeBuffer.push(value[i]);
        }
    });
    return fakeBuffer;
}

function playWithRecords() {
    console.log('START PLAYING WITH RECORDS');
    const myRecord = AzleRecord({ username: text });
    const vecOfMyRec = AzleVec(myRecord);
    const record = { username: 'hello' };
    pe(myRecord, record);
    pe(vecOfMyRec, [record]);
    pe(vecOfMyRec, []);
    pe(vecOfMyRec, [record, record]);
    pe(vecOfMyRec, [record, record, record]);
    pe([myRecord, AzleRecord({ test: int8 })], [record, { test: 3 }]);
    pe(
        [vecOfMyRec, AzleVec(AzleRecord({ test: int }))],
        [[record], [{ test: 3 }]]
    );
    console.log('FINISH PLAYING WITH RECORDS');
}

function playWithComplexRecords() {
    console.log('START PLAYING WITH RECORDS');
    const myRecord = AzleRecord({
        username: AzleVec(AzleRecord({ text: text }))
    });
    const vecOfMyRec = AzleVec(myRecord);
    const record = { username: [{ text: 'hello' }] };
    pe(myRecord, record);
    pe(vecOfMyRec, [record]);
    pe(vecOfMyRec, []);
    pe(vecOfMyRec, [record, record]);
    pe(vecOfMyRec, [record, record, record]);
    pe([myRecord, AzleRecord({ test: int8 })], [record, { test: 3 }]);
    pe(
        [vecOfMyRec, AzleVec(AzleRecord({ test: int }))],
        [[record], [{ test: 1 }, { test: 2 }, { test: 3 }, { test: 4 }]]
    );
    console.log('FINISH PLAYING WITH RECORDS');
}

function playWith11Records() {
    const BlogPost = AzleRecord({
        title: text
    });
    const Reaction = AzleVariant({
        Happy: AzleNull,
        Sad: AzleNull
    });
    const User = AzleRecord({
        username: text,
        posts: AzleVec(BlogPost)
    });
    const vecOfMyRec = AzleVec(User);
    const record = {
        username: 'hello',
        posts: [{ title: 'word' }, { title: 'word' }, { title: 'word' }]
    };
    console.log('START PLAYING WITH 11 RECORDS');
    pe(vecOfMyRec, [record]);
    pe(vecOfMyRec, []);
    pe(vecOfMyRec, [record, record]);
    pe(vecOfMyRec, [record, record, record]);
    console.log('FINISH PLAYING WITH 11 RECORDS');
}

function fakeItTillYouMakeIt(arrayBufferOfEncodedValues: ArrayBuffer[]) {
    const arrayOfEncodedValues = arrayBufferOfEncodedValues.map(
        (value) => new Uint8Array(value)
    );
    const fakeBuffer = [68, 73, 68, 76, 1, 109];
    if (arrayOfEncodedValues.length === 0) {
        fakeBuffer.push(0);
        return fakeBuffer;
    }
    const encodedType = arrayOfEncodedValues[0];
    const [startIndex, endIndex] = getEndOfTypeTable(encodedType);
    const oldTypeTable = encodedType.slice(startIndex, endIndex);
    const encodedArrayOfValues = arrayOfEncodedValues.map((value) => {
        return value.slice(endIndex);
    });
    for (let i = 0; i < oldTypeTable.length; i++) {
        fakeBuffer.push(oldTypeTable[i]);
    }
    fakeBuffer.push(encodedArrayOfValues.length);
    encodedArrayOfValues.forEach((value) => {
        for (let i = 0; i < value.length; i++) {
            fakeBuffer.push(value[i]);
        }
    });
    return fakeBuffer;
}

function examineResult(result: any, valueType: any) {
    console.log('//This is the result we got');
    console.log(JSON.stringify(result), customReplacer);
    const encoded = encode(AzleVec(valueType), result);
    const decoded = decode(AzleVec(valueType), encoded);
    console.log('//Here is the new decoded');
    console.log(JSON.stringify(decoded), customReplacer);
    console.log('//based on this new encoded');
    pe(AzleVec(valueType), result);
}

function examineComplexity() {
    const complexRecord = AzleRecord({
        param1: text,
        param2: AzleRecord({ subParam1: text, subParam2: AzleVec(text) }),
        param3: AzleVariant({
            Hot: AzleNull,
            Cold: AzleNull,
            Warm: AzleNull,
            Cool: AzleNull
        }),
        param4: AzleOpt(text),
        param5: AzleTuple(AzleVec(AzleOpt(AzleRecord({ subParam2: nat16 }))))
    });
    const myComplexRecord = {
        param1: 'hello',
        param2: { subParam1: 'world', subParam2: ['1', '2', '3'] },
        param3: { Hot: null },
        param4: Some('Hello'),
        param5: [[None, Some({ subParam2: 3 })]]
    };
    console.log('//====================');
    console.log('//=== Complex ========');
    console.log('//====================');
    pe(complexRecord, myComplexRecord);
    pe(AzleVec(complexRecord), [
        myComplexRecord,
        myComplexRecord,
        myComplexRecord
    ]);
}

function examineMultipleEncodedValues() {
    console.log('//====================');
    console.log('//=== Multiple =======');
    console.log('//====================');
    pe(
        [AzleRecord({}), AzleVec(text), float32, float64, int, int8],
        [{}, [], 0, 0, 0, 0]
    );
}

function examineVariousVecs() {
    pe(AzleVec(text), []);
    pe(AzleVec(bool), []);
    pe(AzleVec(int8), []);
    pe(AzleVec(AzlePrincipal), []);
    pe(AzleVec(AzleOpt(AzleNull)), []);
    pe(AzleVec(text), ['']);
    pe(AzleVec(text), ['hello']);
    pe(AzleVec(text), ['hello', 'world']);
    pe(AzleVec(int8), [1]);
    pe(AzleVec(nat8), [1]);
    pe(AzleVec(int8), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    pe(AzleVec(bool), [true, false, true]);
}

function examineSimpleTypes() {
    console.log('//====================');
    console.log('//=== Primitives =====');
    console.log('//====================');
    console.log('//=> floats');
    pe(float32, 0);
    pe(float64, 0);
    console.log('//=> ints');
    pe(int, 0);
    pe(int8, 0);
    pe(int16, 0);
    pe(int32, 0);
    pe(int64, 0);
    console.log('//=> nats');
    pe(nat, 0);
    pe(nat8, 0);
    pe(nat16, 0);
    pe(nat32, 0);
    pe(nat64, 0);
    console.log('//=> others');
    pe(bool, false);
    pe(AzleNull, null);
    pe(text, '');
    console.log('//====================');
    console.log('//=== Constructed ====');
    console.log('//====================');
    pe(AzleOpt(text), [], 'Opt<text>');
    pe(AzleOpt(int8), [], 'Opt<int8>');
    pe(AzleRecord({}), {}, 'Record{}');
    pe(AzleRecord({ thing: text }), { thing: 'hello' }, 'Record');
    pe(AzleTuple(text, int), ['hello', 0], 'Tuple');
    pe(AzleVariant({ thing: AzleNull }), { thing: null }, 'Variant');
    pe(AzleVec(text), ['hello'], 'Vec');
    console.log('//====================');
    console.log('//=== Reference ======');
    console.log('//====================');
    pe(AzleFunc([], Void, 'query'), [
        AzlePrincipal.fromText('aaaaa-aa'),
        'create_canister'
    ]);
    // pe(
    //     Canister({ thing: query([], Void) }),
    //     Principal.fromText('aaaaa-aa')
    // );
    pe(AzlePrincipal, AzlePrincipal.fromText('aaaaa-aa'));
}

function pe(
    candidType: CandidType | CandidType[],
    data: any | any[],
    message = ''
) {
    let displayMessage = '';
    if (message !== '') {
        displayMessage = ` (${message})`;
    }
    console.log(
        JSON.stringify(toArr(encode(candidType, data)), customReplacer) +
            '// ' +
            JSON.stringify(data, customReplacer) +
            displayMessage +
            ' in bytes'
    );
}

function toArr(uint8Array: Uint8Array): number[] {
    const numberArray = [];
    for (let i = 0; i < uint8Array.length; i++) {
        numberArray.push(uint8Array[i]);
    }
    return numberArray;
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

export function getEndOfTypeTable(bytes: ArrayBuffer): [number, number] {
    const b = new Pipe(bytes);
    const start = b.byteLength;

    if (bytes.byteLength < magicNumber.length) {
        throw new Error('Message length smaller than magic number');
    }
    const magicBuffer = safeRead(b, magicNumber.length);
    const magic = new TextDecoder().decode(magicBuffer);
    if (magic !== magicNumber) {
        throw new Error(
            'Wrong magic number: ' + JSON.stringify(magic, customReplacer)
        );
    }

    function readTypeTable(pipe: Pipe): [number, number] {
        const len = Number(lebDecode(pipe));
        const start = magicNumber.length + 1;
        let end = start;

        for (let i = 0; i < len; i++) {
            const ty = Number(slebDecode(pipe));
            end += 1;
            switch (ty) {
                case IDLTypeIds.Opt:
                case IDLTypeIds.Vector: {
                    const t = Number(slebDecode(pipe));
                    end += 1;
                    break;
                }
                case IDLTypeIds.Record:
                case IDLTypeIds.Variant: {
                    let objectLength = Number(lebDecode(pipe));
                    end += 1;
                    let prevHash;
                    while (objectLength--) {
                        const hash = Number(lebDecode(pipe));
                        end++;
                        if (hash >= Math.pow(2, 32)) {
                            throw new Error('field id out of 32-bit range');
                        }
                        if (typeof prevHash === 'number' && prevHash >= hash) {
                            throw new Error('field id collision or not sorted');
                        }
                        prevHash = hash;
                        const t = Number(slebDecode(pipe));
                        end++;
                    }
                    break;
                }
                case IDLTypeIds.Func: {
                    let argLength = Number(lebDecode(pipe));
                    end++;
                    while (argLength--) {
                        end++;
                    }
                    const returnValues = [];
                    let returnValuesLength = Number(lebDecode(pipe));
                    end++;
                    while (returnValuesLength--) {
                        returnValues.push(Number(slebDecode(pipe)));
                        end++;
                    }
                    let annotationLength = Number(lebDecode(pipe));
                    end++;
                    while (annotationLength--) {
                        const annotation = Number(lebDecode(pipe));
                        end++;
                        switch (annotation) {
                            case 1:
                            case 2:
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
                    end++;
                    while (servLength--) {
                        const nameLength = Number(lebDecode(pipe));
                        end++;
                        const funcName = new TextDecoder().decode(
                            safeRead(pipe, nameLength)
                        );
                        end += nameLength;
                        const funcType = slebDecode(pipe);
                        end++;
                    }
                    break;
                }
                default:
                    throw new Error('Illegal op_code: ' + ty);
            }
        }

        // TODO what do we do with this guy?  Is he part of the table? if so we need to count it? is it part of the data in which case we dont
        // I'm going to start by assuming he's part of the table
        const length = Number(lebDecode(pipe));
        end++;
        for (let i = 0; i < length; i++) {
            Number(slebDecode(pipe));
            end++;
        }
        return [start, end];
        // return [typeTable, rawList];
    }
    readTypeTable(b);
    return [start, start - b.byteLength];
}

function newReadTypeTable(pipe: Pipe): number {
    const start = pipe.byteLength;
    const typeTable: Array<[IDLTypeIds, any]> = [];
    const len = Number(lebDecode(pipe));

    for (let i = 0; i < len; i++) {
        const ty = Number(slebDecode(pipe));
        switch (ty) {
            case IDLTypeIds.Opt:
            case IDLTypeIds.Vector: {
                const t = Number(slebDecode(pipe));
                typeTable.push([ty, t]);
                break;
            }
            case IDLTypeIds.Record:
            case IDLTypeIds.Variant: {
                const fields = [];
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
                    fields.push([hash, t]);
                }
                typeTable.push([ty, fields]);
                break;
            }
            case IDLTypeIds.Func: {
                const args = [];
                let argLength = Number(lebDecode(pipe));
                while (argLength--) {
                    args.push(Number(slebDecode(pipe)));
                }
                const returnValues = [];
                let returnValuesLength = Number(lebDecode(pipe));
                while (returnValuesLength--) {
                    returnValues.push(Number(slebDecode(pipe)));
                }
                const annotations = [];
                let annotationLength = Number(lebDecode(pipe));
                while (annotationLength--) {
                    const annotation = Number(lebDecode(pipe));
                    switch (annotation) {
                        case 1: {
                            annotations.push('query');
                            break;
                        }
                        case 2: {
                            annotations.push('oneway');
                            break;
                        }
                        case 3: {
                            annotations.push('composite_query');
                            break;
                        }
                        default:
                            throw new Error('unknown annotation');
                    }
                }
                typeTable.push([ty, [args, returnValues, annotations]]);
                break;
            }
            case IDLTypeIds.Service: {
                let servLength = Number(lebDecode(pipe));
                const methods = [];
                while (servLength--) {
                    const nameLength = Number(lebDecode(pipe));
                    const funcName = new TextDecoder().decode(
                        safeRead(pipe, nameLength)
                    );
                    const funcType = slebDecode(pipe);
                    methods.push([funcName, funcType]);
                }
                typeTable.push([ty, methods]);
                break;
            }
            default:
                throw new Error('Illegal op_code: ' + ty);
        }
    }

    const rawList: number[] = [];
    const length = Number(lebDecode(pipe));
    for (let i = 0; i < length; i++) {
        rawList.push(Number(slebDecode(pipe)));
    }
    return start - pipe.byteLength;
}
