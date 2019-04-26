export interface FieldStatus {
    value?: any
    touched?: boolean
    dirty?:boolean
    errors?: string[]
    hasValidated?: boolean
    isValidating?: boolean
}