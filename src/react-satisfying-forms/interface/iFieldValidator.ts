import { Field } from "../field";

export interface IFieldValidator {
    (value: any): Promise<string | undefined> | string | undefined
}