use proc_macro2::TokenStream;
use quote::quote;

pub fn generate() -> TokenStream {
    quote! {
        fn msg_cycles_accept128<'a>(
            context: &'a JSContextRef,
            _this: &CallbackArg,
            args: &[CallbackArg],
        ) -> Result<JSValueRef<'a>, anyhow::Error> {
            let max_amount_vec_u8: Vec<u8> = args
                .get(0)
                .expect("msgCyclesAccept128 must have one argument")
                .to_js_value()?
                .try_into()?;

            let max_amount: u128 = candid::decode_one(&max_amount_vec_u8)?;

            let return_js_value: JSValue =
                candid::encode_one(ic_cdk::api::call::msg_cycles_accept128(max_amount))?.into();
            to_qjs_value(&context, &return_js_value)
        }
    }
}
