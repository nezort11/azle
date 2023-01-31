import { ic, Query, Update, nat32, nat64, Opt } from 'azle';

//#region Performance
type PerfResult = {
    wasm_body_only: nat64;
    wasm_including_prelude: nat64;
};

let perf_result: Opt<PerfResult> = null;

export function get_perf_result(): Query<Opt<PerfResult>> {
    return perf_result;
}

function record_performance(start: nat64, end: nat64): void {
    perf_result = {
        wasm_body_only: end - start,
        wasm_including_prelude: ic.performance_counter(0)
    };
}
//#endregion

// Note: This won't be reflected in the candid until
export type SuperheroId = nat32;

// The type of a superhero.
export type Superhero = {
    name: string;
    superpowers?: Opt<List>;
};

export type List = [string, Opt<List>];

/**
 * Application State
 */

// The next available superhero identifier.
let next: SuperheroId = 0;

// The superhero data store.
let superheroes: Map<SuperheroId, Superhero> = new Map();

/**
 * High-Level API
 */

// Create a superhero.
export function create(superhero: Superhero): Update<SuperheroId> {
    const perf_start = ic.performance_counter(0);

    let superheroId = next;
    next += 1;
    superheroes.set(superheroId, superhero);

    const perf_end = ic.performance_counter(0);
    record_performance(perf_start, perf_end);

    return superheroId;
}

// Read a superhero.
export function read(superheroId: SuperheroId): Query<Opt<Superhero>> {
    let result = superheroes.get(superheroId) ?? null;

    return result;
}

// Update a superhero.
export function update_(
    superheroId: SuperheroId,
    superhero: Superhero
): Update<boolean> {
    const perf_start = ic.performance_counter(0);

    let result = superheroes.get(superheroId);
    if (result) {
        superheroes.set(superheroId, superhero);
    }

    const perf_end = ic.performance_counter(0);
    record_performance(perf_start, perf_end);

    return !!result;
}

// Delete a superhero.
export function delete_hero(superheroId: SuperheroId): Update<boolean> {
    const perf_start = ic.performance_counter(0);

    let result = superheroes.get(superheroId);
    if (result) {
        superheroes.delete(superheroId);
    }

    const perf_end = ic.performance_counter(0);
    record_performance(perf_start, perf_end);
    return !!result;
}

// class API

import { query, update } from 'azle';

export default class {
    /**
     * Application State
     */

    // The next available superhero identifier.
    next: SuperheroId = 0;

    // The superhero data store.
    superheroes: Map<SuperheroId, Superhero> = new Map();

    /**
     * High-Level API
     */

    // Create a superhero.
    @update
    create(superhero: Superhero): SuperheroId {
        const perf_start = ic.performance_counter(0);

        let superheroId = this.next;
        this.next += 1;
        this.superheroes.set(superheroId, superhero);

        const perf_end = ic.performance_counter(0);
        record_performance(perf_start, perf_end);

        return superheroId;
    }

    // Read a superhero.
    @query
    read(superheroId: SuperheroId): Opt<Superhero> {
        let result = this.superheroes.get(superheroId) ?? null;

        return result;
    }

    // Update a superhero.
    @update
    update_(superheroId: SuperheroId, superhero: Superhero): boolean {
        const perf_start = ic.performance_counter(0);

        let result = this.superheroes.get(superheroId);
        if (result) {
            this.superheroes.set(superheroId, superhero);
        }

        const perf_end = ic.performance_counter(0);
        record_performance(perf_start, perf_end);

        return !!result;
    }

    // Delete a superhero.
    @update
    delete_hero(superheroId: SuperheroId): boolean {
        const perf_start = ic.performance_counter(0);

        let result = this.superheroes.get(superheroId);
        if (result) {
            this.superheroes.delete(superheroId);
        }

        const perf_end = ic.performance_counter(0);
        record_performance(perf_start, perf_end);
        return !!result;
    }
}
