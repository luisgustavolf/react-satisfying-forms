import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';
import { IFieldStatus } from './interfaces/iFieldStatus';
import * as ObjectPath from 'object-path';
import * as ValuesHelper from './helpers/valuesHelper'
import { IFieldValidator } from './interfaces/iFieldValidator';

export type FieldInfoTypes = 'touched' | 'dirty' | 'hasValidated' | 'isValidating' | 'errors' | 'validators'

export interface RegisteredFieldsAndValidators {
    [fieldName: string]: IFieldValidator[]
}

export interface StatelessFormProps<TFielValues extends object = {}> {
    values?: IFormValues<TFielValues>
    inspect?: boolean
    onChange?: (formValues: IFormValues<TFielValues>) => void
    onSubmit?: () => void
}

export class StatelessForm<TFielValues extends object = {}> extends React.Component<StatelessFormProps<TFielValues>> {
    
    private registeredFieldsAndValidators: RegisteredFieldsAndValidators = {}
    private didMount = false
    private willUnmout = false

    ////////////////////////////////////////////////////////////
    // Methods called from Fields
    
    setFieldValue(fieldName: string, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || ValuesHelper.getFormValuesWithDefaults();
        const valuesAfter =  ValuesHelper.setFieldValue(valuesBefore, fieldName, value);
        const infosAfter =  ValuesHelper.setFieldInfo(valuesAfter, fieldName, 'errors', []);
        return ValuesHelper.getFormStatusAfterFieldAction(infosAfter);
    }

    getFieldValue(fieldName: string) {
        if (this.props.values && this.props.values.fields && this.props.values.fields.values) 
            return ObjectPath.get(this.props.values.fields.values as any, fieldName)
    }
    
    setFieldInfo(fieldName: string, fieldInfo: FieldInfoTypes, value: any, formValues?:IFormValues<TFielValues>) {
        const valuesBefore = formValues || ValuesHelper.getFormValuesWithDefaults();
        const valuesAfter = ValuesHelper.setFieldInfo(valuesBefore, fieldName, fieldInfo, value);
        return ValuesHelper.getFormStatusAfterFieldAction(valuesAfter);
    }

    getFieldInfos(fieldName: string): IFieldStatus {
        const formValues:IFormValues<TFielValues> = ValuesHelper.getFormValuesWithDefaults();
        return ValuesHelper.getFieldInfo(formValues, fieldName)
    }
    
    getFieldIsChecked(fieldName: string, checkValue: string): boolean | undefined {
        return ObjectPath.get(this.props.values!.fields.values as any, fieldName) === checkValue
    }

    ////////////////////////////////////////////////////////////
    // Validations

    registerFieldValidations(fieldName: string, validators: IFieldValidator[]) {
        this.registeredFieldsAndValidators[fieldName] = validators;

        if (this.didMount) {
            const valuesBefore = this.props.values || ValuesHelper.getFormValuesWithDefaults();
            this.dispatchChanges(valuesBefore)
        }
    }

    unRegisterFieldValidations(fieldName: string) {
        delete this.registeredFieldsAndValidators[fieldName];
        
        if (!this.willUnmout) {
            const valuesBefore = this.props.values || ValuesHelper.getFormValuesWithDefaults();
            this.dispatchChanges(valuesBefore);
        }
    }

    ////////////////////////////////////////////////////////////
    // Dispatch

    dispatchChanges(formValues: IFormValues<TFielValues>) {
        if (this.props.onChange) {
            this.props.onChange(this.adjustFieldsInfos(formValues));
        }
    }

    adjustFieldsInfos(formValues: IFormValues<TFielValues>): IFormValues<TFielValues> {
        const finalValues = {...formValues}
        finalValues.fields.infos = finalValues.fields.infos || {};

        const registeredFieldsNames = Object.keys(this.registeredFieldsAndValidators);
        const previewRegisteredNames = Object.keys(finalValues.fields.infos)
        const diffNames = previewRegisteredNames.filter((item, pos) => registeredFieldsNames.indexOf(item) == -1);

        registeredFieldsNames.forEach((fieldName) => {
            finalValues.fields.infos![fieldName] = {
                dirty: false,
                errors: [],
                isValidating: false,
                touched: false,
                ...finalValues.fields.infos![fieldName],
                validators: this.registeredFieldsAndValidators[fieldName].filter((v) => v !== null),
                rendered: true,
            } as IFieldStatus
        })

        diffNames.forEach((fieldName) => {
            finalValues.fields.infos![fieldName].rendered = false
        })

        return finalValues;
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