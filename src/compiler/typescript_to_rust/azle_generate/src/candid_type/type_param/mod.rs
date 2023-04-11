use cdk_framework::{act::node::candid::TypeParam, traits::ToIdent};
use swc_ecma_ast::TsTypeAliasDecl;

use crate::ts_ast::{source_map::SourceMapped, GetName};
use quote::quote;

impl SourceMapped<'_, TsTypeAliasDecl> {
    pub fn get_type_params(&self) -> Vec<TypeParam> {
        let type_params = if let Some(type_params) = &self.type_params {
            type_params
            .params
            .iter()
            .map(|type_param| TypeParam {
                name: type_param.name.get_name().to_string(),
                try_into_vm_value_trait_bound: quote!(
                    for<'a> CdkActTryIntoVmValue<
                        &'a mut boa_engine::Context<'a>,
                        boa_engine::JsValue,
                    >
                ),
                try_from_vm_value_trait_bound: |name_string| {
                    let name = name_string.to_ident();

                    quote!(
                        boa_engine::JsValue:
                        for<'a> CdkActTryFromVmValue<#name, &'a mut boa_engine::Context<'a>> + for<'a> CdkActTryFromVmValue<Box<#name>, &'a mut boa_engine::Context<'a>>
                    )
                },
            })
            .collect()
        } else {
            vec![]
        };

        type_params
    }
}
