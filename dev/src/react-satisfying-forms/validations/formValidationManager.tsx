import { FieldValidationManager } from "./fieldValidatonManager";
import { FieldValidations } from '../interfaces/fieldValidations';
import { flattenObject } from '../util/objectUtil';
import { FieldValidation } from "../interfaces/fieldValidation";

export interface FieldValidationWithValidationMng<TData>  {
    fieldname: string
    validations: FieldValidation<TData> 
    validationManager: FieldValidationManager
}

export class FormValidationManager<TData> {

    fieldsValidations: FieldValidationWithValidationMng<TData>[] = []
    
    registerFieldsValidations(fieldValidations: FieldValidations<TData>) {
        const flattendFieldValidations = flattenObject(fieldValidations)
        for (const key in flattendFieldValidations) {
            if (flattendFieldValidations.hasOwnProperty(key)) {
                this.registerFieldValidations(key, flattendFieldValidations[key])
            }
        }
    }

    registerFieldValidations(fieldname: string, validations: FieldValidation<TData>) {
        const fieldValidator = this.getFieldValidations(fieldname)
        
        if (fieldValidator)
            fieldValidator.validations = validations
        else
            this.fieldsValidations.push({
                fieldname,
                validations,
                validationManager: new FieldValidationManager()
            })
    }

    getFieldValidations(fieldname: string) {
        return this.fieldsValidations.find((fd) => fd.fieldname == fieldname)
    }

    getFieldsWithValidations() {
        return this.fieldsValidations.map((validations) => validations.fieldname)
    }
}