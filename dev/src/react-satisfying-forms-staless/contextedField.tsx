import * as React from 'react'
import { StatelessForm } from './statelessForm';
import { IFieldBidings } from './interfaces/iFieldBidings';
import { IFieldActions } from './interfaces/iFieldActions';
import { FieldProps } from './field';

export interface ContextedFieldProps extends FieldProps { 
    form: StatelessForm<any>
}

export function ContextedField(props: ContextedFieldProps) {
    
    function onClick() {
        const formValues = props.form.setFieldStatus(props.name, 'touched', true)
        props.form.dispatchChanges(formValues)
    }

    function onFocus() {
    }

    function onBlur(evt: React.FocusEvent<any>) {
        let nextValues = props.form.setFieldStatus(props.name, 'touched', true)
        const errors = validate(evt.target.value)
        nextValues = props.form.setFieldStatus(props.name, 'errors', errors, nextValues)
        props.form.dispatchChanges(nextValues)
    }

    function onChange(evt: React.ChangeEvent<any>) {
        let nextValues = props.form.setFieldValue(props.name, evt.target.value);
        const errors = validate(evt.target.value)
        nextValues = props.form.setFieldStatus(props.name, 'errors', errors, nextValues)
        props.form.dispatchChanges(nextValues)
    }
    
    function validate(value: any) {
        let errors: string[] | undefined = undefined

        if (props.require && !value) 
            errors = ['Campo obrigatorio']

        return errors
    }

    //////////////////////////////////////////////////////////
    // Render

    const fieldStatus = props.form.getFieldStatus(props.name);
    
    const fieldActions:IFieldActions = {
        onChange,
        onClick,
        onBlur,
        onFocus,
    }
    
    const fieldBidings: IFieldBidings = {
        value: props.form.getFieldValue(props.name) || '',
        name: props.name,
        checkable: props.checkable,
        checked: props.checkable && props.value ? props.form.getFieldIsChecked(props.name, props.value) : false,
        ...fieldStatus,
        ...fieldActions 
    }
    
    return (
        <React.Fragment>
            { props.children && props.children(fieldBidings) }
        </React.Fragment>
    )
}