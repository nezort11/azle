use swc_common::SourceMap;

use crate::ts_ast::traits::{GetSourceInfo, GetSpan};

use super::GetSourceFileInfo;

pub struct SourceMapped<'a, T> {
    inner: &'a T,
    pub source_map: &'a SourceMap,
}

impl<'a, T> SourceMapped<'a, T> {
    pub fn new(inner: &'a T, source_map: &'a SourceMap) -> Self {
        Self { inner, source_map }
    }
}

impl<'a, T> Clone for SourceMapped<'a, T> {
    fn clone(&self) -> Self {
        Self {
            inner: self.inner,
            source_map: self.source_map,
        }
    }
}

impl<T> std::ops::Deref for SourceMapped<'_, T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl<T> GetSourceInfo for SourceMapped<'_, T>
where
    T: GetSpan,
{
    fn get_range(&self) -> (usize, usize) {
        self.source_map.get_range(self.get_span())
    }

    fn get_source(&self) -> String {
        self.source_map.get_source(self.get_span())
    }

    fn get_origin(&self) -> String {
        self.source_map.get_origin(self.get_span())
    }

    fn get_line_number(&self) -> usize {
        self.source_map.get_line_number(self.get_span())
    }
}
