export interface FieldStatus {
    touched?: boolean
    dirty?:boolean
    errors?: string[]
    hasValidated?: boolean
    isValidating?: boolean
}