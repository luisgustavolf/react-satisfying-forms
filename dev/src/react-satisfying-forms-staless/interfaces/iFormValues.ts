import { IFieldStatus } from "./iFieldStatus";
import { IFormStatus } from "./iFormStatus";

export interface IFormValues<TValues> {
    fields?: {
        values?: TValues
        status?: {
            [fieldName: string]: IFieldStatus
        }
    }
    form?: IFormStatus
}