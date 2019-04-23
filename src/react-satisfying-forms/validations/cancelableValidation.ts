import { FieldValidatorAssyncResult, FieldValidatorSyncResult } from "../interface/fieldValidator";

export interface CancelableProps {
    (args: (
        done: (value: any) => void,
        cancel: (cancel: () => void) => void
    ) => void): FieldValidatorAssyncResult
}

export const CancelableValidation:CancelableProps = (args) => {
    let cancel: any
    const cancelSetter = (cancelFunction: () => void) => { cancel = cancelFunction }

    const promise = new Promise<FieldValidatorSyncResult>((resolve, reject) => {
        args(resolve, cancelSetter)
    })

    return {
        promise,
        cancel
    }
}