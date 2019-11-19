import { IFieldStatus } from "./iFieldStatus";
import { IFormStatus } from "./iFormStatus";
import { RegisteredFieldsAndValidators } from "../statelessForm";

export interface IFormValues<TValues extends object = {}> {
    fields: {
        values: TValues
        infos?: {
            [fieldName: string]: IFieldStatus
        }
    }
    form?: IFormStatus
}