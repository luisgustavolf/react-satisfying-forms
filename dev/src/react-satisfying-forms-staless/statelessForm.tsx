import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';
import { IFieldStatus } from './interfaces/iFieldStatus';
import * as ObjectPath from 'object-path';
import * as ValuesHelper from './helpers/valuesHelper'
import { IFieldValidator } from './interfaces/iFieldValidator';

export type FieldStatusProp = 'touched' | 'dirty' | 'hasValidated' | 'isValidating' | 'errors'

export interface RegisteredFields {
    [fieldName: string]: IFieldValidator[]
}

export interface StatelessFormProps<TFielValues extends object = {}> {
    values?: IFormValues<TFielValues>
    inspect?: boolean
    onChange?: (formValues: IFormValues<TFielValues>) => void
    onSubmit?: () => void
}

export class StatelessForm<TFielValues extends object = {}> extends React.Component<StatelessFormProps<TFielValues>> {
    
    private registeredFields: RegisteredFields = {}
    private didMount = false
    private willUnmout = false

    ////////////////////////////////////////////////////////////
    // Methods called from Fields
    
    setFieldValue(fieldName: string, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || ValuesHelper.getFormValuesWithDefaults();
        const valuesAfter =  ValuesHelper.setFieldValue(valuesBefore, fieldName, value);
        return ValuesHelper.getFormStatusAfterFieldAction(valuesAfter);
    }

    getFieldValue(fieldName: string) {
        if (this.props.values && this.props.values.fields && this.props.values.fields.values) 
            return ObjectPath.get(this.props.values.fields.values as any, fieldName)
    }
    
    setFieldStatus(fieldName: string, status: FieldStatusProp, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || ValuesHelper.getFormValuesWithDefaults();
        const valuesAfter = ValuesHelper.setFieldStatus(valuesBefore, fieldName, status, value);
        return ValuesHelper.getFormStatusAfterFieldAction(valuesAfter);
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
        this.registeredFields[fieldName] = validators;

        if (this.didMount) {
            const valuesBefore = this.props.values || ValuesHelper.getFormValuesWithDefaults();
            this.dispatchChanges(valuesBefore)
        }
    }

    unRegisterFieldValidations(fieldName: string) {
        delete this.registeredFields[fieldName];
        
        if (!this.willUnmout) {
            const valuesBefore = this.props.values || ValuesHelper.getFormValuesWithDefaults();
            this.dispatchChanges(valuesBefore);
        }
    }

    ////////////////////////////////////////////////////////////
    // Dispatch

    dispatchChanges(formValues: IFormValues<TFielValues>) {
        if (this.props.onChange) {
            this.props.onChange({...formValues, fields: {...formValues.fields, registeredFieldsAndValidators: this.registeredFields }});
        }
    }

    ////////////////////////////////////////////////////////////
    // Render

    componentDidMount() {
        this.didMount = true;
        const firstValues = this.props.values || ValuesHelper.getFormValuesWithDefaults();
        this.dispatchChanges(firstValues);
    }

    componentWillUnmount() {
        this.willUnmout = true;
    }

    ////////////////////////////////////////////////////////////
    // Render

    render() {
        return (
            <FormContext.Provider value={{ form: this }} >
                {this.props.children}
                {this.props.inspect && 
                    <pre>
                        { JSON.stringify(this.props.values, null, 4) }
                    </pre>
                }
            </FormContext.Provider>
        );
    }
}