export interface IFieldStatus {
    touched?: boolean
    dirty?:boolean
    hasValidated?: boolean
    isValidating?: boolean
    insideErrors?: string[]
    outsideErrors?: string[]
    [prop: string]: any
}