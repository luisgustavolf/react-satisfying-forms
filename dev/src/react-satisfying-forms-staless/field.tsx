import * as React from 'react'
import { StatelessForm } from './statelessform';
import { FieldBidings } from '../react-satisfying-forms/interfaces/fieldBidings';

export interface PublicFieldProps { 
    fName: string
    fCheckable?: boolean
    fCheckValue?: string
    children?: (fieldBindings: FieldBidings) => any
}

export interface FieldProps extends PublicFieldProps { 
    fForm: StatelessForm<any>
}

export function Field(props: FieldProps) {
    
    function onClick() {
        props.fForm.setFieldStatus(props.fName, 'touched', true)
    }

    function onFocus() {
    }

    function onBlur() {
        props.fForm.setFieldStatus(props.fName, 'touched', true)
    }

    function onChange(evt: React.ChangeEvent<any>) {
        props.fForm.setFieldValue(props.fName, evt.target.value)
    }
    
    //////////////////////////////////////////////////////////
    // Render

    const fieldBidings: FieldBidings = {
        value: props.fForm.getFieldValue(props.fName),
        checked: props.fCheckable && props.fCheckValue ? props.fForm.getFieldIsChecked(props.fName, props.fCheckValue) : false,
        onChange,
        onClick,
        onBlur,
        onFocus
    }
    
    return (
        <React.Fragment>
            { props.children && props.children(fieldBidings) }
        </React.Fragment>
    )
}