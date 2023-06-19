use proc_macro2::TokenStream;
use quote::quote;

pub fn generate(function_name: &String) -> TokenStream {
    let function_call = format!("{function_name}()");
    quote! {
        BOA_CONTEXT_REF_CELL.with(|boa_context_ref_cell| {
            let mut boa_context = boa_context_ref_cell.borrow_mut();

            let js_guard_fn_return_value = boa_context
                .eval_script(boa_engine::Source::from_bytes(#function_call))
                .unwrap_or_trap(&mut boa_context);

            match js_guard_fn_return_value.try_from_vm_value(&mut *boa_context) {
                Ok(return_value) => return_value,
                Err(e) => ic_cdk::api::trap(&format!("Uncaught TypeError: {}",&e.0))
            }
        })
    }
}
