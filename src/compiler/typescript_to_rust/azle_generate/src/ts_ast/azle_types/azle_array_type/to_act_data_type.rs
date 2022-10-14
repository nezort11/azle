use crate::cdk_act::nodes::data_type_nodes::{
    ActArray, ActArrayLiteral, ActArrayTypeAlias, LiteralOrTypeAlias,
};
use crate::cdk_act::{ActDataType, ToActDataType};
use crate::ts_ast::AzleArrayType;

impl ToActDataType for AzleArrayType<'_> {
    fn to_act_data_type(&self, alias_name: &Option<&String>) -> crate::cdk_act::ActDataType {
        let elem_ts_type = self.ts_array_type.elem_type.clone();
        let act_elem = elem_ts_type.to_act_data_type(&None);
        match alias_name {
            Some(name) => ActDataType::Array(ActArray {
                act_type: LiteralOrTypeAlias::TypeAlias(ActArrayTypeAlias {
                    name: name.clone().clone(),
                    enclosed_type: Box::from(act_elem.clone()),
                }),
            }),
            None => ActDataType::Array(ActArray {
                act_type: LiteralOrTypeAlias::Literal(ActArrayLiteral {
                    enclosed_type: Box::from(act_elem.clone()),
                }),
            }),
        }
    }
}
