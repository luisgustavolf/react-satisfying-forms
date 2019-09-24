import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';
import { IFieldStatus } from './interfaces/iFieldStatus';
import * as ObjectPath from 'object-path';
import * as DeepMerge from 'deepmerge'
import * as ValuesHelper from './util/valuesHelper'
import { IFieldValidator } from './interfaces/iFieldValidator';
import { FormValidationManager } from './validations/formValidationManager';

export type FieldStatusProp = 'touched' | 'dirty' | 'hasValidated' | 'isValidating' | 'errors'

export interface StatelessFormProps<TFielValues extends object = {}> {
    values?: IFormValues<TFielValues>
    inspect?: boolean
    onChange?: (formValues: IFormValues<TFielValues>) => void
    onSubmit?: () => void
}

export class StatelessForm<TFielValues extends object = {}> extends React.Component<StatelessFormProps<TFielValues>> {
    
    private formValidationManager: FormValidationManager<any>

    constructor(props: any) {
        super(props);
        this.formValidationManager = new FormValidationManager();
    }

    ////////////////////////////////////////////////////////////
    // Methods called from Fields
    
    setFieldValue(fieldName: string, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || ValuesHelper.getFormValuesWithDefaults();
        const valuesAfter =  ValuesHelper.setFieldValue(valuesBefore, fieldName, value);
        return ValuesHelper.getFormStatusAfterFieldAction(valuesBefore, valuesAfter);
    }

    getFieldValue(fieldName: string) {
        if (this.props.values && this.props.values.fields && this.props.values.fields.values) 
            return ObjectPath.get(this.props.values.fields.values as any, fieldName)
    }
    
    setFieldStatus(fieldName: string, status: FieldStatusProp, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || ValuesHelper.getFormValuesWithDefaults();
        const valuesAfter = ValuesHelper.setFieldStatus(valuesBefore, fieldName, status, value);
        return ValuesHelper.getFormStatusAfterFieldAction(valuesBefore, valuesAfter);
    }

    getFieldStatus(fieldName: string): IFieldStatus {
        const formValues:IFormValues<TFielValues> = ValuesHelper.getFormValuesWithDefaults();
        return ValuesHelper.getFieldStatus(formValues, fieldName)
    }
    
    getFieldIsChecked(fieldName: string, checkValue: string): boolean | undefined {
        return ObjectPath.get(this.props.values!.fields.values as any, fieldName) === checkValue
    }

    ////////////////////////////////////////////////////////////
    // Validations

    registerFieldValidations(fieldName: string, validators: IFieldValidator[]) {
        this.formValidationManager.registerFieldValidations(fieldName, validators)
    }

    unRegisterFieldValidations(fieldName: string) {
        this.formValidationManager.unRegisterFieldValidations(fieldName)
    }

    async validateField(fieldName: string) {
        if (this.props.values && this.props.values.fields) {
            const valuesBefore = this.setFieldStatus(fieldName, 'isValidating', true);
            this.dispatchChanges(valuesBefore);

            const results = await this.formValidationManager.validateField(this.getFieldValue(fieldName), this.props.values.fields.values);
            let valuesAfter = this.setFieldStatus(fieldName, 'isValidating', false, valuesBefore);

            if (results) {
                this.setFieldStatus(fieldName, 'errors', results.errors, valuesAfter);
            }
            
            this.dispatchChanges(valuesAfter);
        }
    }

    async validate() {
        if (this.props.values && this.props.values.fields) {
            const results = await this.formValidationManager.validateFields(this.props.values.fields.values);
        }
    }

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