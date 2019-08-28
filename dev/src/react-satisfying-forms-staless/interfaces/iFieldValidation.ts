import { IFieldValidator } from "./iFieldValidator";

export interface IFieldValidation<TData> {
    (fieldValues: TData): IFieldValidator[]
}