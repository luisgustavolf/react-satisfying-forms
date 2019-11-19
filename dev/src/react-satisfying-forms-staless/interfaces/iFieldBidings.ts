import { RefObject } from "react";
import { IFieldActions } from "./iFieldActions";
import { IFieldStatus } from "./iFieldStatus";

export interface IFieldBidings extends IFieldActions, IFieldStatus {
    ref?: RefObject<any>
    name?: string
    value?: any
    checked?: boolean
}