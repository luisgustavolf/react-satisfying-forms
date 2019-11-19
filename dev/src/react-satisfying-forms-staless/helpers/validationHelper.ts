import { IFormValues } from "../interfaces/iFormValues";
import { IFieldValidator, FieldValidatorSyncResult, FieldValidatorAssyncResult } from "../interfaces/iFieldValidator";
import * as ValuesHelper from './valuesHelper';

interface IFieldValidators {
    fieldName: string,
    validators: IFieldValidator[]
}

interface IFieldValidationResult {
    fieldName: string,
    syncResults: FieldValidatorSyncResult[]
    asyncResults: FieldValidatorAssyncResult[]
}

interface IOnUpdateFn<TValues extends object> {
    (formValues: IFormValues<TValues>): void
}

export function validateForm<TValues extends object>(formValues: IFormValues<TValues>, onError: IOnUpdateFn<TValues>, onComplete: IOnUpdateFn<TValues>) {
    if (!formValues.fields.infos) return;
    
    const fieldsValidators = getValidFieldsValidators(formValues);
    const validationsResults = fieldsValidators.map((v) => validateField(formValues, v));
    const hasSyncErrors = validationsResults.some(vr => vr.syncResults.some(syncErr => typeof syncErr === 'string'))
    const hasASyncExecutions = validationsResults.some(vr => vr.asyncResults.length > 0)
    
    let newFormValues = updateFieldValuesAfterSyncExecution(formValues, validationsResults);
    newFormValues = ValuesHelper.getFormStatusAfterFieldAction(newFormValues)

    if (!hasASyncExecutions) {
        onComplete(newFormValues)
    } else {
        onError(newFormValues)
    }
}

function validateField(formValues: IFormValues<any>, fieldValidators: IFieldValidators) {
    const fieldValue = ValuesHelper.getFieldValue(formValues, fieldValidators.fieldName);
    const validations = fieldValidators.validators.map((v) => v(fieldValue))
    
    const syncResults = validations.filter(v => typeof v === 'string' || v === undefined) as FieldValidatorSyncResult[];
    const asyncResults = validations.filter(v => typeof v !== 'string' && v !== undefined) as FieldValidatorAssyncResult[]; 
    
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
        finalFormValues = ValuesHelper.setFieldInfo(finalFormValues, vr.fieldName, 'errors', errors.length ? errors : [])
    })

    return finalFormValues;
}

function getValidFieldsValidators(formValues: IFormValues<any>) {
    if (!formValues.fields.infos) 
        return [];

    const registeredFieldsKeys = Object.keys(formValues.fields.infos)
    
    let fieldsWithValidations = registeredFieldsKeys.map((key) => { 
        if (formValues.fields.infos && formValues.fields.infos[key] && formValues.fields.infos[key].validators) {
            const fieldValidators = formValues.fields.infos[key].validators || []
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