use proc_macro2::TokenStream;
use quote::quote;

pub fn generate() -> TokenStream {
    quote! {
        fn stable_b_tree_map_is_empty<'a>(
            context: &'a JSContextRef,
            _this: &CallbackArg,
            args: &[CallbackArg],
        ) -> Result<JSValueRef<'a>, anyhow::Error> {
            let memory_id_candid_bytes: Vec<u8> = args.get(0).expect("stable_b_tree_map_get argument 0 is undefined").to_js_value()?.try_into()?;
            let memory_id: u8 = candid::decode_one(&memory_id_candid_bytes)?;

            let result_js_value: JSValue = STABLE_B_TREE_MAPS.with(|stable_b_tree_maps| {
                let stable_b_tree_maps = stable_b_tree_maps.borrow();

                stable_b_tree_maps[&memory_id].is_empty()
            }).into();

            to_qjs_value(&context, &result_js_value)
        }
    }
}
