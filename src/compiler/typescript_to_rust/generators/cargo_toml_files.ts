import { Toml } from '../../../types';

export function generateWorkspaceCargoToml(rootPath: string): Toml {
    return `
        # This code is automatically generated by Azle

        [workspace]
        members = [
            "${rootPath}"
        ]

        [profile.release]
        lto = true
        opt-level = 'z'
    `;
}

export function generateLibCargoToml(canisterName: string): Toml {
    return `
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
    `;
}