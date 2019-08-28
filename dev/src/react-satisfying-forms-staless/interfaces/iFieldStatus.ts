export interface IFieldStatus {
    touched?: boolean
    dirty?:boolean
    hasValidated?: boolean
    isValidating?: boolean
    errors?: string[]
    [prop: string]: any
}