export type FieldValidatorSyncReturn = string | undefined

export type FieldValidatorAssyncReturn = {
    promise: Promise<FieldValidatorSyncReturn>
    interrupCallback?: () => void
}

export type FieldValidatorReturn = FieldValidatorSyncReturn | FieldValidatorAssyncReturn

export interface IFieldValidator {
    (value: any): FieldValidatorReturn
}