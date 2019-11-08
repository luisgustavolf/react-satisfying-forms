import { IFieldStatus } from "./iFieldStatus";
import { IFormStatus } from "./iFormStatus";
import { RegisteredFields } from "../statelessForm";

export interface IFormValues<TValues extends object = {}> {
    fields: {
        values: TValues
        status?: {
            [fieldName: string]: IFieldStatus
        }
        registeredFieldsAndValidators?: RegisteredFields
    }
    form?: IFormStatus
}