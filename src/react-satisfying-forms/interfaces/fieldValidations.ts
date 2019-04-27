import { FieldValidation } from "./fieldValidation";

export interface FieldValidations<TData = {}> {
    [prop: string]: FieldValidation<TData> | FieldValidations<TData>
}