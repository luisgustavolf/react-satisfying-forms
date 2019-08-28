import { IFieldValidation } from "./iFieldValidation";

export interface IFieldValidations<TData = {}> {
    [prop: string]: IFieldValidation<TData> | IFieldValidations<TData>
}