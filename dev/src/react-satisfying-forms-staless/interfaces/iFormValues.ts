import { IFieldStatus } from "./iFieldStatus";
import { IFormStatus } from "./iFormStatus";

export interface IFormValues<TValues extends object = {}> {
    fields: {
        values: TValues
        infos?: {
            [fieldName: string]: IFieldStatus
        }
    }
    form?: IFormStatus
}