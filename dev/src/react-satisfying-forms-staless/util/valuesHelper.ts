import * as DeepMerge from 'deepmerge'
import * as ObjectPath from 'object-path';
import { IFormValues } from "../interfaces/iFormValues";
import { FieldStatusProp } from "../statelessForm";
import { IFieldStatus } from '../interfaces/iFieldStatus';

///////////////////////////////////////////////////////////
// Values

export function getFieldValue(formValues:IFormValues<any>, fieldName: string) {
    if (formValues && formValues.fields && formValues.fields.values) 
        return ObjectPath.get(formValues.fields.values as any, fieldName)
}


export function setFieldValue(formValues:IFormValues<any>, fieldName: string, value: any) {
    ObjectPath.set(formValues.fields.values as any, fieldName, value);
    return setFieldStatus(formValues, fieldName, 'dirty', true);
}

///////////////////////////////////////////////////////////
// Field Status

export function getFieldStatus(formValues:IFormValues<any>, fieldName: string): IFieldStatus {
    return formValues.fields.status![fieldName] || {}
}

export function setFieldStatus(formValues:IFormValues<any>, fieldName: string, status: FieldStatusProp, value: any): IFormValues<any> {
    const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: DeepMerge.Options) => sourceArray

    return DeepMerge.default(formValues, { 
        fields: {
            status: {
                [fieldName]: {
                    [status]: value
                }        
            }
        }
    }, { 
        arrayMerge: overwriteMerge
    })
}

///////////////////////////////////////////////////////////
// Form Status

export function getFormStatusAfterFieldAction(before: IFormValues<any>, after: IFormValues<any>):  IFormValues<any> {
    const status = after.fields.status!;
    const dirty = Object.values(status).some((status) => status.dirty ? true : false)
    const hasErrors = Object.values(status).some((status) => status.errors && status.errors.length > 0 ? true : false)
    
    return { 
        ...after, 
        form: { 
            ...after.form, 
            dirty,
            hasErrors
        }
    };
}