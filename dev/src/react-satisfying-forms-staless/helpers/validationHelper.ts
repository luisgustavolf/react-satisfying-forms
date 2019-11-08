import { IFormValues } from "../interfaces/iFormValues";
import { IFieldValidator } from "../interfaces/iFieldValidator";

interface IFieldNameAndValidators {
    fieldName: string,
    validators: IFieldValidator[]
}

interface IOnUploadteFn<TValues extends object> {
    (formValues: IFormValues<TValues>): void
}

interface IOnCompleteFn<TValues extends object> {
    (formValues: IFormValues<TValues>): void
}

export function ValidateForm<TValues extends object>(formValues: IFormValues<TValues>, onError: IOnUploadteFn<TValues>, onComplete: IOnCompleteFn<TValues>) {
    if (!formValues.fields.registeredFields) return;
    const validValidators = getValidValidators(formValues);
    validValidators.forEach((v) => v.fieldName)
}

function getValidValidators(formValues: IFormValues<any>) {
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
            } as IFieldNameAndValidators
        }
    }) 

    fieldsWithValidations = fieldsWithValidations.filter(f => f !== undefined) 

    return fieldsWithValidations as IFieldNameAndValidators[];
}

export default {}