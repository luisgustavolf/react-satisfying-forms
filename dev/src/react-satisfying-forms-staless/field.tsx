import * as React from 'react'
import { StatelessForm } from './statelessform';
import { IFieldBidings } from './interfaces/iFieldBidings';
import { IFieldActions } from './interfaces/iFieldActions';

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
        props.fForm.setFieldStatus(props.name, 'touched', true)
    }

    function onFocus() {
    }

    function onBlur() {
        props.fForm.setFieldStatus(props.name, 'touched', true)
    }

    function onChange(evt: React.ChangeEvent<any>) {
        if (props.require) {
            
        }

        props.fForm.setFieldValue(props.name, evt.target.value)
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
        value: props.fForm.getFieldValue(props.name),
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