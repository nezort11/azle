use super::AzleKeywordType;
use crate::cdk_act::{nodes::data_type_nodes::ActPrimitiveLit, ActDataType, ToActDataType};
use swc_ecma_ast::TsKeywordTypeKind;

impl ToActDataType for AzleKeywordType<'_> {
    fn to_act_data_type(&self, alias_name: &Option<&String>) -> ActDataType {
        match self.ts_keyword_type.kind {
            TsKeywordTypeKind::TsBooleanKeyword => ActPrimitiveLit::Bool,
            TsKeywordTypeKind::TsStringKeyword => ActPrimitiveLit::String,
            TsKeywordTypeKind::TsVoidKeyword => ActPrimitiveLit::Void,
            TsKeywordTypeKind::TsNullKeyword => ActPrimitiveLit::Null,
            _ => panic!("{}", self.unsupported_type_error()),
        }
        .to_act_data_type(alias_name)
    }
}
