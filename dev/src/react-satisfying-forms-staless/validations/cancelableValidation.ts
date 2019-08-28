import { FieldValidatorAssyncResult, FieldValidatorSyncResult } from "../interfaces/iFieldValidator";

export interface CancelableValidatorProps {
    (args: (
        done: (value: any) => void,
        cancel: (cancel: () => void) => void
    ) => void): FieldValidatorAssyncResult
}

export const CancelableValidator:CancelableValidatorProps = (args) => {
    let cancel = () => {}
    const cancelSetter = (cancelFunction: () => void) => { cancel = cancelFunction }

    const promise = new Promise<FieldValidatorSyncResult>((resolve, reject) => {
        args(resolve, cancelSetter)
    })

    return {
        promise,
        cancel: cancel
    }
}