import { FieldValidationManager } from "./fieldValidatonManager";
import { IFieldValidator } from "../interfaces/iFieldValidator";
import * as OPath from 'object-path';
import { isPrimitive } from "util";

export interface IValidationResult {
    fieldName: string,
    errors: string[]
}

export interface FieldValidationWithValidationMng<TData>  {
    fieldname: string
    validators: IFieldValidator[]
    validationManager: FieldValidationManager
}

export class FormValidationManager<TData> {

    fieldsValidations: FieldValidationWithValidationMng<TData>[] = []

    unRegisterFieldValidations(fieldname: string) { 
        const pos = this.fieldsValidations.findIndex((i) => i.fieldname == fieldname);
        
        if (pos > -1) {
            this.fieldsValidations.splice(pos, 1);
        }
    }
    
    registerFieldValidations(fieldname: string, validators: IFieldValidator[]) {
        const fieldValidator = this.getFieldValidations(fieldname)
        
        if (fieldValidator)
            fieldValidator.validators = validators
        else
            this.fieldsValidations.push({
                fieldname,
                validators: validators,
                validationManager: new FieldValidationManager()
            })
    }

    getFieldValidations(fieldname: string) {
        return this.fieldsValidations.find((fd) => fd.fieldname == fieldname)
    }

    getFieldsWithValidations() {
        return this.fieldsValidations.map((validations) => validations.fieldname)
    }

    async validateField(fieldName: string, value: any) {
        const fieldValidator = this.getFieldValidations(fieldName)
        
        if (!fieldValidator) return;
        
        return await new Promise<IValidationResult>((resolve) => {
            fieldValidator.validationManager.validate(value, fieldValidator.validators, () => {}, (errors) => {
                resolve({
                    fieldName,
                    errors: errors || []
                })
            })    
        })
    }

    async validateFields(values?: any) {
        if (!values) [];
        
        const runningValidations = this.fieldsValidations.map((fv) => {
            const fieldValue = OPath.get(values, fv.fieldname);
            return new Promise<IValidationResult>((resolve) => {
                fv.validationManager.validate(fieldValue, fv.validators, () => {}, (errors) => { 
                    resolve({
                        fieldName: fv.fieldname,
                        errors: errors || []
                    }) 
                })
            })
        })

        const results = await Promise.all(runningValidations);

        return results;
    }
}