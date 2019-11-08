import { IFormValues } from "../interfaces/iFormValues";
import { IFieldValidator, FieldValidatorSyncResult, FieldValidatorAssyncResult } from "../interfaces/iFieldValidator";
import * as ValuesHelper from './valuesHelper';
import { reverse } from "dns";

interface IFieldValidators {
    fieldName: string,
    validators: IFieldValidator[]
}

interface IFieldValidationResult {
    fieldName: string,
    syncResults: FieldValidatorSyncResult[]
    asyncResults: FieldValidatorAssyncResult[]
}

interface IOnUploadteFn<TValues extends object> {
    (formValues: IFormValues<TValues>): void
}

interface IOnCompleteFn<TValues extends object> {
    (formValues: IFormValues<TValues>): void
}

export function ValidateForm<TValues extends object>(formValues: IFormValues<TValues>, onAsyncError: IOnUploadteFn<TValues>, onAsyncComplete: IOnCompleteFn<TValues>) {
    if (!formValues.fields.registeredFields) return;
    
    const fieldsValidators = getValidFieldsValidators(formValues);
    const validationsResults = fieldsValidators.map((v) => validateField(formValues, v));
    const hasSyncErrors = validationsResults.some(vr => vr.syncResults.some(syncErr => typeof syncErr === 'string'))
    const hasASyncExecutions = validationsResults.some(vr => vr.asyncResults)
    
    if (!hasSyncErrors && !hasASyncExecutions)
        return;

    const newFormValues = updateFieldValuesAfterSyncExecution(formValues, validationsResults);
    const finalFormValues = ValuesHelper.getFormStatusAfterFieldAction(newFormValues);
}

function validateField(formValues: IFormValues<any>, fieldValidators: IFieldValidators) {
    const fieldValue = ValuesHelper.getFieldValue(formValues, fieldValidators.fieldName);
    const validations = fieldValidators.validators.map((v) => v(fieldValue))
    
    const syncResults = validations.filter(v => typeof v === 'string' || v === undefined) as FieldValidatorSyncResult[];
    const asyncResults = validations.filter(v => typeof v !== 'string' && v === undefined) as FieldValidatorAssyncResult[]; 
    
    return {
        fieldName: fieldValidators.fieldName,
        syncResults,
        asyncResults
    } as IFieldValidationResult
}

function updateFieldValuesAfterSyncExecution(formValues: IFormValues<any>, validationResult: IFieldValidationResult[]) {
    let finalFormValues = {...formValues};

    validationResult.forEach(vr => {
        const errors = vr.syncResults.filter(sr => sr !== undefined);

        if (errors.length) {
            finalFormValues = ValuesHelper.setFieldStatus(finalFormValues, vr.fieldName, 'errors', errors)
        } else {
            finalFormValues = ValuesHelper.setFieldStatus(finalFormValues, vr.fieldName, 'errors', [])
        }
    })

    return finalFormValues;
}

function getValidFieldsValidators(formValues: IFormValues<any>) {
    if (!formValues.fields.registeredFields) 
        return [];

    const registeredFieldsKeys = Object.keys(formValues.fields.registeredFields)
    
    let fieldsWithValidations = registeredFieldsKeys.map((key) => { 
        if (formValues.fields.registeredFields && formValues.fields.registeredFields[key]) {
            const fieldValidators = formValues.fields.registeredFields[key]
            const validValidators = fieldValidators.filter(v => typeof v === 'function')
            
            return {
                fieldName: key,
                validators: validValidators
            } as IFieldValidators
        }
    }) 

    fieldsWithValidations = fieldsWithValidations.filter(f => f !== undefined) 

    return fieldsWithValidations as IFieldValidators[];
}

export default {}