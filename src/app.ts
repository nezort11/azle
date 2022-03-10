import * as fs from 'fs';
import {
    execSync,
    spawn
} from 'child_process';
import { compileJSToRust } from './compile';
import * as swc from '@swc/core';

app();

type DfxJson = Readonly<{
    canisters: Readonly<{
        [key: string]: JSCanisterConfig;
    }>;
}>;

type JSCanisterConfig = Readonly<{
    type: 'custom';
    build: string;
    root: string;
    ts: string;
    candid: string;
    wasm: string;
}>;

async function app() {
    const canisterName = process.argv[2];
    const dfxJson: DfxJson = JSON.parse(fs.readFileSync('dfx.json').toString());
    const canisterConfig = dfxJson.canisters[canisterName];

    const rootPath = canisterConfig.root;
    const tsPath = canisterConfig.ts;
    const candidPath = canisterConfig.candid;

    await createRustCode(
        canisterName,
        rootPath,
        tsPath,
        candidPath
    );

    compileRustCode(canisterName);

    generateCandid(
        canisterName,
        candidPath
    );
}

async function createRustCode(
    canisterName: string,
    rootPath: string,
    tsPath: string,
    candidPath: string
) {
    createCargoTomls(
        canisterName,
        rootPath
    );

    await createLibRs(
        rootPath,
        tsPath
    );
}

function createCargoTomls(
    canisterName: string,
    rootPath: string
) {
    if (!fs.existsSync(`./target/azle`)) {
        fs.mkdirSync(`target/azle`, { recursive: true });
    }

    fs.writeFileSync('./target/azle/Cargo.toml', `
        # This code is automatically generated by Azle

        [workspace]
        members = [
            "${rootPath}"
        ]

        [profile.release]
        lto = true
        opt-level = 'z'
    `);

    if (!fs.existsSync(`./target/azle/${rootPath}`)) {
        fs.mkdirSync(`target/azle/${rootPath}`, { recursive: true });
    }

    fs.writeFileSync(`./target/azle/${rootPath}/Cargo.toml`, `
        # This code is automatically generated by Azle

        [package]
        name = "${canisterName}"
        version = "0.0.0"
        edition = "2018"

        [lib]
        crate-type = ["cdylib"]

        [dependencies]
        ic-cdk = "0.3.2"
        ic-cdk-macros = "0.3.2"
        # Boa = { git = "https://github.com/lastmjs/boa-azle" }
        boa_engine = { git = "https://github.com/boa-dev/boa", rev = "a44be7073b678afd2ce0472108b6315ea4b81574" }
        getrandom = { version = "0.2.3", features = ["custom"] }
        serde = "1.0.130"
        serde_json = "1.0.68"
    `);
}

async function createLibRs(
    rootPath: string,
    tsPath: string
) {
    if (!fs.existsSync(`./target/azle/${rootPath}/src`)) {
        fs.mkdirSync(`./target/azle/${rootPath}/src`);
    }

    // TODO probably  get rid of this read file sync
    const ts = fs.readFileSync(tsPath).toString();

    const js = await compileTSToJS(tsPath);

    const rust = compileJSToRust(
        tsPath,
        js
    );

    fs.writeFileSync(`./target/azle/${rootPath}/src/lib.rs`, rust);
}

async function compileTSToJS(tsPath: string): Promise<string> {
    // First we bundle, which transpiles the TS into JS and creates one giant string with all modules concatenated
    const bundleResult = await swc.bundle({
        entry: {
            bundle: tsPath
        },
        output: {
            name: '',
            path: ''
        },
        module: {},
        options: {
            jsc: {
                experimental: {
                    cacheRoot: '/dev/null' // TODO I am taking the easy way out to just get rid of the cache for now. This was creating a .swc directory in the users' cwd
                }
            }
        }
    });

    const bundledJS = bundleResult.bundle.code;

    // Then we convert the remaining ES modules syntax to CommonJS which is easier to deal with in boa
    // and we transpile to es3 to hopefully get good compatibility with boa
    return swc.transformSync(bundledJS, {
        module: {
            type: 'commonjs'
        },
        jsc: {
            parser: {
                syntax: 'ecmascript'
            },
            target: 'es3'
        },
        minify: false // TODO keeping this off for now, enable once the project is more stable
    }).code;
}

function compileRustCode(canisterName: string) {
    execSync(
        `cd target/azle && CARGO_TARGET_DIR=.. cargo build --target wasm32-unknown-unknown --package ${canisterName} --release`,
        { stdio: 'inherit' }
    );

    // optimization, binary is too big to deploy without this
    execSync(
        `cd target/azle && cargo install ic-cdk-optimizer --root ..`,
        { stdio: 'inherit' }
    );
    execSync(
        `./target/bin/ic-cdk-optimizer ./target/wasm32-unknown-unknown/release/${canisterName}.wasm -o ./target/wasm32-unknown-unknown/release/${canisterName}.wasm`,
        { stdio: 'inherit' }
    );
}

function generateCandid(
    canisterName: string,
    candidPath: string
) {
    execSync(
        `touch ${candidPath}`,
        { stdio: 'inherit' }
    );

    // TODO I should probably just write this in JS so it can be cross-platform and less hacky than bash
    const child = spawn(`
        INDEX=0

        # Get the sha256 sum of the compiled wasm binary
        local_sha_sum_text=$(sha256sum ./target/wasm32-unknown-unknown/release/${canisterName}.wasm)

        # remove the file path from the output of sha256sum
        local_sha_sum=\${local_sha_sum_text//"  ./target/wasm32-unknown-unknown/release/${canisterName}.wasm"/}
        
        # get the currently installed wasm hash from the canister
        canister_sha_sum_text=$(dfx canister info ${canisterName})
        
        # make sure we have not done 10 iterations and that the wasm binary hashes do not match
        while [ $INDEX -lt 10 ] && [[ $canister_sha_sum_text != *"$local_sha_sum"* ]]
        do
            sleep 1
            canister_sha_sum_text=$(dfx canister info ${canisterName})
        done
        
        # once the hashes match, we request the Candid from the canister
        canister_candid_unedited=$(dfx canister call ${canisterName} __get_candid_interface_tmp_hack --query)

        # remove the surrounding parentheses and quotes
        canister_candid_edited_0=\${canister_candid_unedited/"("/}
        canister_candid_edited_1=\${canister_candid_edited_0/\\"/}

        # reverse the string
        canister_candid_edited_2=$(echo "$canister_candid_edited_1" | tac | rev)

        # remove the other surrounding parentheses and quotes
        canister_candid_edited_3=\${canister_candid_edited_2/")"/}
        canister_candid_edited_4=\${canister_candid_edited_3/","/}
        canister_candid_edited_5=\${canister_candid_edited_4/\\"/}

        # reverse the string again to return it to its original form
        canister_candid_edited_6=$(echo "$canister_candid_edited_5" | tac | rev)

        echo "$canister_candid_edited_6" > ${candidPath}
    `, {
        detached: true,
        stdio: 'ignore',
        shell: '/bin/bash'
    });

    child.unref();
}