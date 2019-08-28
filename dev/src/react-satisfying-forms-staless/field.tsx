import * as React from 'react'
import { StatelessForm } from './statelessForm';
import { IFieldBidings } from './interfaces/iFieldBidings';
import { IFieldActions } from './interfaces/iFieldActions';
import { IFormValues } from './interfaces/iFormValues';

export interface PublicFieldProps { 
    name: string
    checkable?: boolean
    value?: string
    inspect?: boolean
    require?: boolean
    validations?: any[]
    children?: (fieldBindings: IFieldBidings) => any
}

export interface FieldProps extends PublicFieldProps { 
    fForm: StatelessForm<any>
}

export function Field(props: FieldProps) {
    
    function onClick() {
        const formValues = props.fForm.setFieldStatus(props.name, 'touched', true)
        props.fForm.dispatchChanges(formValues)
    }

    function onFocus() {
    }

    function onBlur(evt: React.FocusEvent<any>) {
        let nextValues = props.fForm.setFieldStatus(props.name, 'touched', true)
        const errors = validate(evt.target.value)
        nextValues = props.fForm.setFieldStatus(props.name, 'errors', errors, nextValues)
        props.fForm.dispatchChanges(nextValues)
    }

    function onChange(evt: React.ChangeEvent<any>) {
        let nextValues = props.fForm.setFieldValue(props.name, evt.target.value);
        const errors = validate(evt.target.value)
        nextValues = props.fForm.setFieldStatus(props.name, 'errors', errors, nextValues)
        props.fForm.dispatchChanges(nextValues)
    }
    
    function validate(value: any) {
        let errors: string[] | undefined = undefined

        if (props.require && !value) 
            errors = ['Campo obrigatorio']

        return errors
    }

    //////////////////////////////////////////////////////////
    // Render

    const fieldStatus = props.fForm.getFieldStatus(props.name);
    
    const fieldActions:IFieldActions = {
        onChange,
        onClick,
        onBlur,
        onFocus,
    }
    
    const fieldBidings: IFieldBidings = {
        value: props.fForm.getFieldValue(props.name) || '',
        name: props.name,
        checkable: props.checkable,
        checked: props.checkable && props.value ? props.fForm.getFieldIsChecked(props.name, props.value) : false,
        ...fieldStatus,
        ...fieldActions 
    }
    
    return (
        <React.Fragment>
            { props.children && props.children(fieldBidings) }
        </React.Fragment>
    )
}