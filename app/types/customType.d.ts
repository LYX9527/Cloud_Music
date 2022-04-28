
declare global {
    const $ref: typeof import('vue/macros')['$ref']
    const $:typeof import('vue/macros')['$']
    type Ref<T> = import('vue').Ref<T>
    type RefValue<T> = import('vue/macros').RefValue<T>
}
export {}