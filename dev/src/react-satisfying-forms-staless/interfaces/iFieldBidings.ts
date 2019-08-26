import { IFieldActions } from "./iFieldActions";
import { RefObject } from "react";
import { IFieldStatus } from "./iFieldStatus";

export interface IFieldBidings extends IFieldActions, IFieldStatus {
    ref?: RefObject<any>
    value?: any
    checked?: boolean
}