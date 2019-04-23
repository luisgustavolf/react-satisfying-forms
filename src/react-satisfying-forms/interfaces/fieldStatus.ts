export interface FieldStatus {
    touched?: boolean
    dirty?:boolean
    errors?: string[]
    isValidating?: boolean
}