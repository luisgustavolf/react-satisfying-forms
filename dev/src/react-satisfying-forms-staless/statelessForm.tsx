import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';
import { IFieldStatus } from './interfaces/iFieldStatus';
import * as ObjectPath from 'object-path';
import * as DeepMerge from 'deepmerge'
import * as ValuesHelper from './util/valuesHelper'

export type FieldStatusProp = 'touched' | 'dirty' | 'hasValidated' | 'isValidating' | 'errors'

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
        const valuesAfter =  ValuesHelper.setFieldValue(valuesBefore, fieldName, value);
        return ValuesHelper.getFormStatusAfterFieldAction(valuesBefore, valuesAfter);
    }

    getFieldValue(fieldName: string) {
        if (this.props.values && this.props.values.fields && this.props.values.fields.values) 
            return ObjectPath.get(this.props.values.fields.values as any, fieldName)
    }
    
    setFieldStatus(fieldName: string, status: FieldStatusProp, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || this.getFormValuesWithDefaults();
        const valuesAfter = ValuesHelper.setFieldStatus(valuesBefore, fieldName, status, value);
        return ValuesHelper.getFormStatusAfterFieldAction(valuesBefore, valuesAfter);
    }

    getFieldStatus(fieldName: string): IFieldStatus {
        const formValues:IFormValues<TFielValues> = this.getFormValuesWithDefaults();
        return ValuesHelper.getFieldStatus(formValues, fieldName)
    }
    
    getFieldIsChecked(fieldName: string, checkValue: string): boolean | undefined {
        return ObjectPath.get(this.props.values!.fields.values as any, fieldName) === checkValue
    }

    ////////////////////////////////////////////////////////////
    // Form

    
    
    ////////////////////////////////////////////////////////////
    // Dispatch

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