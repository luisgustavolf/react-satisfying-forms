import { FieldValidator } from "./fieldValidator";

export interface FieldValidation<TData> {
    (fieldValues: TData): FieldValidator[]
}