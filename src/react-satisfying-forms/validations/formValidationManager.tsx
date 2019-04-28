import { FieldValidationManager } from "./fieldValidatonManager";
import { FieldValidations } from '../interfaces/fieldValidations';
import { flattenObject } from '../util/objectUtil';
import { FieldValidation } from "../interfaces/fieldValidation";
import * as OPath from 'object-path';

export interface FieldValidationWithValidationMng<TData>  {
    fieldname: string
    validations: FieldValidation<TData> 
    validationManager: FieldValidationManager
    hasValidated?: boolean
}

export class FormValidationManager<TData> {

    fieldValidation: FieldValidationWithValidationMng<TData>[] = []
    
    constructor(fieldValidations: FieldValidations<TData>) {
        this.processProps(fieldValidations)
    }

    processProps(fieldValidations: FieldValidations<TData>) {
        const flattendFieldValidations = flattenObject(fieldValidations)
        for (const key in flattendFieldValidations) {
            if (flattendFieldValidations.hasOwnProperty(key)) {
                this.registerValidations(key, flattendFieldValidations[key])
            }
        }
    }

    getFielValidation(fieldname: string) {
        return this.fieldValidation.find((fd) => fd.fieldname == fieldname)
    }

    registerValidations(fieldname: string, validations: FieldValidation<TData>) {
        if (this.getFielValidation(fieldname) === undefined)
            return
        
        this.fieldValidation.push({
            fieldname,
            validations,
            validationManager: new FieldValidationManager()
        })
    }

    async validateField(fieldname: string, fieldValues: TData, onError: (fieldname: string, errors: string[]) => void) {
        const fieldValidation = this.getFielValidation(fieldname);
        if (!fieldValidation)
            return 
        
        const fieldValue = OPath.get(fieldValues as any, fieldname)
        const fieldValidators = fieldValidation.validations(fieldValues)

        return new Promise((resolve) => {
            fieldValidation.validationManager.validate(
                fieldValue, 
                fieldValidators, 
                (errors) => { onError(fieldname, errors) },
                (errors) => { 
                    fieldValidation.hasValidated = true; 
                    resolve() 
                })
        })
    }

    async validateAllFields(fieldValues: TData, onError: (fieldname: string, errors: string[]) => void, force?:boolean) {
        if (!this.fieldValidation.length)
            return

        const fieldsThatHaventValidateYet = this.fieldValidation.filter((fieldValidation) => {
            return !fieldValidation.hasValidated || force
        })

        const validators = fieldsThatHaventValidateYet.map((fieldValidation) => this.validateField(fieldValidation.fieldname, fieldValues, onError))
        await Promise.all(validators);
    }

}