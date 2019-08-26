export interface IFormStatus {
    isValidating?: boolean
    hasValidated?: boolean
    hasErrors?: boolean
    dirty?: boolean
    [prop: string]: any
}