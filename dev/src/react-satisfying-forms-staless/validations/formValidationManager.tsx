import { FieldValidationManager } from "./fieldValidatonManager";
import { IFieldValidations } from '../interfaces/iFieldValidations';
import { flattenObject } from '../util/objectUtil';
import { IFieldValidation } from "../interfaces/iFieldValidation";
import * as OPath from 'object-path';

export interface FieldValidationWithValidationMng<TData>  {
    fieldname: string
    validations: IFieldValidation<TData> 
    validationManager: FieldValidationManager
}

export class FormValidationManager<TData> {

    fieldsValidations: FieldValidationWithValidationMng<TData>[] = []
    
    registerFieldsValidations(fieldValidations: IFieldValidations<TData>) {
        const flattendFieldValidations = flattenObject(fieldValidations)
        for (const key in flattendFieldValidations) {
            if (flattendFieldValidations.hasOwnProperty(key)) {
                this.registerFieldValidations(key, flattendFieldValidations[key])
            }
        }
    }

    registerFieldValidations(fieldname: string, validations: IFieldValidation<TData>) {
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