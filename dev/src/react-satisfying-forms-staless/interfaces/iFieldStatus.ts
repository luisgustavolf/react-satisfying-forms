import { IFieldValidator } from "./iFieldValidator";

export interface IFieldStatus {
    rendered?: boolean
    touched?: boolean
    dirty?:boolean
    isValidating?: boolean
    errors?: string[]
    validators?: IFieldValidator[]
    [prop: string]: any
}