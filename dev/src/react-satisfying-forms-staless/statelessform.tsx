import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';
import * as ObjectPath from 'object-path';
import * as DeepMerge from 'deepmerge'

type FieldStatus = 'touched' | 'dirty' | 'hasValidated' | 'isValidating' | 'insideErrors' | 'outsideErrors'

export interface StatelessFormProps<TFielValues extends object = {}> {
    values?: IFormValues<TFielValues>
    inspect?: boolean
    onChange?: (formValues: IFormValues<TFielValues>) => void
    onSubmit?: () => void
}

export class StatelessForm<TFielValues extends object = {}> extends React.Component<StatelessFormProps<TFielValues>> {
    
    ////////////////////////////////////////////////////////////
    // Methods called from Fields
    
    setFieldValue(fieldName: string, value: any) {
        let formValues:IFormValues<TFielValues> = this.getFormValues();
        formValues = this.setStateFieldValue(formValues, fieldName, value);
        this.dispatchChanges(formValues);
    }

    getFieldValue(fieldName: string) {
        if (this.props.values && this.props.values.fields && this.props.values.fields.values) {
            return ObjectPath.get(this.props.values.fields.values as any, fieldName)
        }
    }
    
    setFieldStatus(fieldName: string, status: FieldStatus, value: any) {
        let formValues:IFormValues<TFielValues> = this.getFormValues();
        formValues = this.setStateFieldStatus(formValues, fieldName, status, value);
        this.dispatchChanges(formValues);
    }

    getFieldStatus(fieldName: string, status: string, value: string) {

    }
    
    getFieldIsChecked(fieldName: string, checkValue: string): boolean | undefined {
        return undefined    
    }

    ////////////////////////////////////////////////////////////
    // Form's State Setters

    setStateFieldValue(formValues:IFormValues<TFielValues>, fieldName: string, value: any) {
        ObjectPath.set(formValues.fields.values as any, fieldName, value);
        return this.setStateFieldStatus(formValues, fieldName, 'dirty', true);
    }

    setStateFieldStatus(formValues:IFormValues<TFielValues>, fieldName: string, status: FieldStatus, value: any): IFormValues<TFielValues> {
        return DeepMerge.default(formValues, { 
            fields: {
                status: {
                    [fieldName]: {
                        [status]: value
                    }        
                }
            }
        })
    }
    
    getFormValues(): IFormValues<TFielValues> {
        const defaults:IFormValues<TFielValues> = {
            fields: {
                status: {},
                values: {} as any
            },
            form: {
                dirty: false,
                hasErrors: false,
                hasValidated: false,
                isValidating: false
            }
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