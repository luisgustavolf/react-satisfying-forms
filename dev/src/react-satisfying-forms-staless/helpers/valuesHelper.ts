import * as DeepMerge from 'deepmerge'
import * as ObjectPath from 'object-path';
import { IFormValues } from "../interfaces/iFormValues";
import { FieldStatusProp, RegisteredFields } from "../statelessForm";
import { IFieldStatus } from '../interfaces/iFieldStatus';

///////////////////////////////////////////////////////////
// Values

export function getFieldValue(formValues:IFormValues<any>, fieldName: string) {
    if (formValues && formValues.fields && formValues.fields.values) 
        return ObjectPath.get(formValues.fields.values as any, fieldName)
}


export function setFieldValue(formValues:IFormValues<any>, fieldName: string, value: any) {
    const values = formValues || getFormValuesWithDefaults();
    ObjectPath.set(values.fields.values as any, fieldName, value);
    return setFieldStatus(values, fieldName, 'dirty', true);
}

///////////////////////////////////////////////////////////
// Field Status

export function getFieldStatus(formValues:IFormValues<any>, fieldName: string): IFieldStatus {
    return formValues.fields.status![fieldName] || {}
}

export function setFieldStatus(formValues:IFormValues<any>, fieldName: string, status: FieldStatusProp, value: any): IFormValues<any> {
    const values = formValues || getFormValuesWithDefaults();
    const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: DeepMerge.Options) => sourceArray

    return DeepMerge.default(values, { 
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

export function getFormStatusAfterFieldAction(formValues: IFormValues<any>):  IFormValues<any> {
    const status = formValues.fields.status!;
    const dirty = Object.values(status).some((status) => status.dirty ? true : false)
    const hasErrors = Object.values(status).some((status) => status.errors && status.errors.length > 0 ? true : false)
    
    return { 
        ...formValues, 
        form: { 
            ...formValues.form, 
            dirty,
            hasErrors
        }
    };
}

export function getFormValuesWithDefaults(formValues?: IFormValues<any>): IFormValues<any> {
    const defaults:IFormValues<any> = {
        fields: {
            status: {},
            values: {} as any
        },
        form: { }
    }
    
    return DeepMerge.default(defaults, formValues || {})
}