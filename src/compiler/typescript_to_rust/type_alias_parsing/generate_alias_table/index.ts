import * as ts from 'typescript';
import { generateAliasTableFromSymbolTable } from './alias_table';
import { getSymbolTable } from '../utils/get_symbol_table';
import { AliasTable, AliasTables } from './types';
export { AliasTable, AliasTables } from './types';
import { GenerationType } from '../types';

export function generateAliasTables(
    files: string[],
    program: ts.Program,
    generationType: GenerationType
): AliasTables | boolean {
    return files.reduce((acc: AliasTables, filename: string) => {
        const aliasTable = generateAliasTable(
            filename,
            program,
            generationType
        );
        if (aliasTable === undefined || typeof aliasTable === 'boolean') {
            return acc;
        }
        return {
            ...acc,
            [filename]: aliasTable
        };
    }, {});
}

function generateAliasTable(
    filename: string,
    program: ts.Program,
    generationType: GenerationType
): AliasTable | undefined | boolean {
    const sourceFile = program.getSourceFile(filename);

    if (sourceFile === undefined) {
        return undefined;
    }

    const symbolTable = getSymbolTable(sourceFile, program);
    if (symbolTable) {
        return generateAliasTableFromSymbolTable(
            symbolTable,
            program,
            generationType
        );
    }

    return undefined;
}
