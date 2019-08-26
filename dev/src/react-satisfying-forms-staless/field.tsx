import * as React from 'react'
import { Form } from './form';
import { FieldBidings } from '../react-satisfying-forms/interfaces/fieldBidings';

export interface PublicFieldProps { 
    fName: string
    fCheckable?: boolean
    fCheckValue?: string
    children?: (fieldBindings: FieldBidings) => any
}

export interface FieldProps extends PublicFieldProps { 
    fForm: Form<any>
}

export function Field(props: FieldProps) {
    
    function onClick() {

    }

    function onFocus() {

    }

    function onBlur() {

    }

    function onChange() {

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