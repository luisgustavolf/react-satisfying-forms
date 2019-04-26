import { FieldStatus } from "./fieldStatus";

export interface FieldStatusWithErrorHint extends FieldStatus {
    shouldDisplayErrors?:boolean
}