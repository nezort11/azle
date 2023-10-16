import {
    Canister,
    None,
    Opt,
    Record,
    StableBTreeMap,
    Vec,
    Void,
    bool,
    float32,
    ic,
    int,
    int32,
    nat,
    nat8,
    query,
    text,
    update
} from 'azle';

const TableO = Record({
    col1: text,
    col2: float32
});

const TableV = Record({ col1: text, col2: float32 });

const TableU = Record({ col1: int32, col2: text, col3: text, col4: text });

const TableM = Record({
    col1: text,
    col2: bool,
    col3: int,
    col4: bool,
    col5: Opt(text),
    col6: text,
    col7: Vec(TableO),
    col8: Vec(TableV),
    col9: int32,
    col10: text,
    col11: Opt(Vec(TableU)),
    col12: Opt(Vec(text))
});

const myRecord = Record({ text: text, id: nat });

let stableMap1 = StableBTreeMap(nat8, TableM, 0);
let stableMap2 = StableBTreeMap(nat, myRecord, 1);

export default Canister({
    simpleQuery: query([], text, () => {
        return 'This is a query function';
    }),
    simpleFiller: update([], Void, () => {
        for (let i = 0; i < 1000; i++) {
            const myFiller = { text: 'Hello', id: BigInt(i) };
            stableMap2.insert(BigInt(i), myFiller);
            const before = ic.instructionCounter();
            // console.log(stableMap2.values());
            stableMap2.values();
            const after = ic.instructionCounter();
            console.log(`Instructions with ${i} items: ${after - before}`);
        }
    }),
    fill: update([nat, nat], Void, (start, count) => {
        for (let i = start; i < start + count; i++) {
            const myFiller = { text: 'Hello', id: i };
            const before = ic.instructionCounter();
            stableMap2.insert(BigInt(i), myFiller);
            const after = ic.instructionCounter();
            console.log(`Instructions with ${i} items: ${after - before}`);
        }
    }),
    view: update([], Vec(myRecord), () => {
        const before = ic.instructionCounter();
        const result = stableMap2.values();
        const after = ic.instructionCounter();
        console.log(`Instructions to view ${result.length}: ${after - before}`);
        return result;
    }),
    fillerUp: update([], Vec(TableM), () => {
        const myFiller = {
            col1: 'hello',
            col2: true,
            col3: 1n,
            col4: false,
            col5: None,
            col6: '!',
            col7: [],
            col8: [],
            col9: 2,
            col10: 'world',
            col11: None,
            col12: None
        };
        for (let i = 0; i < 10; i++) {
            stableMap1.insert(0, myFiller);
        }
        const before = ic.instructionCounter();
        const result = stableMap1.values();
        const after = ic.instructionCounter();
        console.log(`Instructions: ${after - before}`);
        return result;
    })
});
