import { IFieldActions } from "./iFieldActions";

export interface IFieldBidings extends IFieldActions {
    value?: any
    errors?: string[]
    touched?: boolean
    dirty?: boolean
}