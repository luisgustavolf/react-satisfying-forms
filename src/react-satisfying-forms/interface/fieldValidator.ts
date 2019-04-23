export type FieldValidatorSyncResult = string | undefined

export type FieldValidatorAssyncResult = {
    promise: Promise<FieldValidatorSyncResult>
    cancel?: () => void
}

export type FieldValidatorResult = FieldValidatorSyncResult | FieldValidatorAssyncResult

export interface FieldValidator {
    (value: any): FieldValidatorResult
}