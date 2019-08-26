import { IFieldStatus } from "./iFieldStatus";
import { IFormStatus } from "./iFormStatus";

export interface IFormValues<TValues extends object = {}> {
    fields?: {
        values?: TValues
        status?: {
            [fieldName: string]: IFieldStatus
        }
    }
    form?: IFormStatus
}