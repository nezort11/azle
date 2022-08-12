import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CanisterSettings {
    freezing_threshold: [] | [bigint];
    controllers: [] | [Array<Principal>];
    memory_allocation: [] | [bigint];
    compute_allocation: [] | [bigint];
}
export type CanisterStatus =
    | { stopped: null }
    | { stopping: null }
    | { running: null };
export interface CanisterStatusArgs {
    canister_id: Principal;
}
export interface CanisterStatusResult {
    status: CanisterStatus;
    memory_size: bigint;
    cycles: bigint;
    settings: DefiniteCanisterSettings;
    module_hash: [] | [Array<number>];
}
export interface CreateCanisterArgs {
    settings: [] | [CanisterSettings];
}
export interface CreateCanisterResult {
    canister_id: Principal;
}
export type Curve = { secp256k1: null };
export interface DefiniteCanisterSettings {
    freezing_threshold: bigint;
    controllers: Array<Principal>;
    memory_allocation: bigint;
    compute_allocation: bigint;
}
export interface DeleteCanisterArgs {
    canister_id: Principal;
}
export interface DepositCyclesArgs {
    canister_id: Principal;
}
export interface EcdsaPublicKeyArgs {
    key_id: KeyID;
    canister_id: [] | [string];
    derivation_path: Array<Array<number>>;
}
export interface EcdsaPublicKeyResult {
    public_key: Array<number>;
    chain_code: Array<number>;
}
export type EcdsaResult = { ok: Array<number> } | { err: string };
export interface HttpHeader {
    value: string;
    name: string;
}
export type HttpMethod = { GET: null } | { HEAD: null } | { POST: null };
export interface HttpRequestArgs {
    url: string;
    transform_method_name: [] | [string];
    max_response_bytes: [] | [bigint];
    body: [] | [Array<number>];
    headers: Array<HttpHeader>;
    http_method: HttpMethod;
}
export interface HttpResponse {
    status: bigint;
    body: Array<number>;
    headers: Array<HttpHeader>;
}
export interface InstallCodeArgs {
    arg: Array<number>;
    wasm_module: Array<number>;
    mode: InstallCodeMode;
    canister_id: Principal;
}
export type InstallCodeMode =
    | { reinstall: null }
    | { upgrade: null }
    | { install: null };
export interface KeyID {
    name: string;
    curve: Curve;
}
export interface ProvisionalCreateCanisterWithCyclesArgs {
    settings: [] | [CanisterSettings];
    amount: [] | [bigint];
}
export interface ProvisionalCreateCanisterWithCyclesResult {
    canister_id: Principal;
}
export interface ProvisionalTopUpCanisterArgs {
    canister_id: Principal;
    amount: bigint;
}
export interface SignWithEcdsaArgs {
    key_id: KeyID;
    derivation_path: Array<Array<number>>;
    message_hash: Array<number>;
}
export interface SignWithEcdsaResult {
    signature: Array<number>;
}
export interface StartCanisterArgs {
    canister_id: Principal;
}
export interface StopCanisterArgs {
    canister_id: Principal;
}
export interface UninstallCodeArgs {
    canister_id: Principal;
}
export interface UpdateSettingsArgs {
    canister_id: Principal;
    settings: CanisterSettings;
}
export interface _SERVICE {
    public_key: ActorMethod<[], EcdsaResult>;
    sign: ActorMethod<[Array<number>], EcdsaResult>;
}
