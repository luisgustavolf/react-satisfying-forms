import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';
import * as ObjectPath from 'object-path';
import * as DeepMerge from 'deepmerge'
import { IFieldStatus } from './interfaces/iFieldStatus';

type FieldStatus = 'touched' | 'dirty' | 'hasValidated' | 'isValidating' | 'errors'

export interface StatelessFormProps<TFielValues extends object = {}> {
    values?: IFormValues<TFielValues>
    inspect?: boolean
    onChange?: (formValues: IFormValues<TFielValues>) => void
    onSubmit?: () => void
}

export class StatelessForm<TFielValues extends object = {}> extends React.Component<StatelessFormProps<TFielValues>> {
    
    ////////////////////////////////////////////////////////////
    // Methods called from Fields
    
    setFieldValue(fieldName: string, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || this.getFormValuesWithDefaults();
        const valuesAfter = this.setStateFieldValue(valuesBefore, fieldName, value);
        return this.getFormStatusAfterFieldAction(valuesBefore, valuesAfter);
    }

    getFieldValue(fieldName: string) {
        if (this.props.values && this.props.values.fields && this.props.values.fields.values) {
            return ObjectPath.get(this.props.values.fields.values as any, fieldName)
        }
    }
    
    setFieldStatus(fieldName: string, status: FieldStatus, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || this.getFormValuesWithDefaults();
        const valuesAfter = this.setStateFieldStatus(valuesBefore, fieldName, status, value);
        return this.getFormStatusAfterFieldAction(valuesBefore, valuesAfter);
    }

    getFieldStatus(fieldName: string): IFieldStatus {
        const formValues:IFormValues<TFielValues> = this.getFormValuesWithDefaults();
        return formValues.fields.status![fieldName] || {}
    }
    
    getFieldIsChecked(fieldName: string, checkValue: string): boolean | undefined {
        return ObjectPath.get(this.props.values!.fields.values as any, fieldName) === checkValue
    }

    ////////////////////////////////////////////////////////////
    // Form's State Setters

    setStateFieldValue(formValues:IFormValues<TFielValues>, fieldName: string, value: any) {
        ObjectPath.set(formValues.fields.values as any, fieldName, value);
        return this.setStateFieldStatus(formValues, fieldName, 'dirty', true);
    }

    setStateFieldStatus(formValues:IFormValues<TFielValues>, fieldName: string, status: FieldStatus, value: any): IFormValues<TFielValues> {
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
    
    getFormValuesWithDefaults(): IFormValues<TFielValues> {
        const defaults:IFormValues<TFielValues> = {
            fields: {
                status: {},
                values: {} as any
            },
            form: { }
        }
        
        return DeepMerge.default(defaults, this.props.values || {})
    }

    ////////////////////////////////////////////////////////////
    // Form

    dispatchChanges(formValues: IFormValues<TFielValues>) {
        if (this.props.onChange) {
            this.props.onChange(formValues);
        }
    }

    getFormStatusAfterFieldAction(before: IFormValues<TFielValues>, after: IFormValues<TFielValues>):  IFormValues<TFielValues> {
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

    ////////////////////////////////////////////////////////////
    // Render

    render() {
        return (
            <FormContext.Provider value={{ form: this }} >
                {this.props.children}
                {this.props.inspect && 
                    <div>INSPECTOR</div>
                }
            </FormContext.Provider>
        );
    }
}