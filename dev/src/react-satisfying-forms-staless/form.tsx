import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';
import * as ObjectPath from 'object-path';
import * as DeepMerge from 'deepmerge'

export interface FormProps<TFielValues extends object = {}> {
    values?: IFormValues<TFielValues>
    inspect?: boolean
    onChange?: (formValues: IFormValues<TFielValues>) => void
    onSubmit?: () => void
}

export class Form<TFielValues extends object = {}> extends React.Component<FormProps<TFielValues>> {
    
    ////////////////////////////////////////////////////////////
    // Fields
    
    getFieldStatus(fieldName: string, status: string, value: string) {

    }
    
    setFieldStatus(formValues:IFormValues<TFielValues> ,fieldName: string, status: string, value: any) {
        console.log(formValues)
        formValues.fields!.status = { 
            ...formValues.fields!.status,
            [fieldName]: {
                ...(formValues.fields!.status![fieldName] || {}),
                dirty: true
            }
        };
    }

    getFieldIsChecked(fieldName: string, checkValue: string): boolean | undefined {
        return undefined    
    }

    setFieldValue(fieldName: string, value: any) {
        const formValues:IFormValues<TFielValues> = this.getFormValues();
        console.log(formValues)
        ObjectPath.set(formValues.fields!.values as any, fieldName, value);
        this.setFieldStatus(formValues, fieldName, 'dirty', true);
        
        if (this.props.onChange) {
            this.props.onChange(formValues);
        }
    }

    getFieldValue(fieldName: string) {
        if (this.props.values && this.props.values.fields && this.props.values.fields.values) {
            return ObjectPath.get(this.props.values.fields.values as any, fieldName)
        }
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

    getFormStatus() {
        
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