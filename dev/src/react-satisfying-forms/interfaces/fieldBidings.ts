import { FieldActions } from "./fieldActions";
import { RefObject } from "react";

export interface FieldBidings extends FieldActions {
    ref?: RefObject<any>
    value?: any
    checked?: boolean
    errors?: string[]
    touched?: boolean
    dirty?: boolean
}