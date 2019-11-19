import { IFieldValidator } from "./iFieldValidator";

export interface IFieldStatus {
    touched: boolean
    dirty:boolean
    hasValidated: boolean
    isValidating: boolean
    errors: string[]
    validators: IFieldValidator[]
    [prop: string]: any
}