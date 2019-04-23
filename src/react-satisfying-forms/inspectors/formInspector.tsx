import * as React from 'react'
import { Form } from '../form';
import { Inspector } from './inspector';

export interface IFormInspector {
    inspect: boolean
    form: Form
    children?: any
}

export function FormInspector (props: IFormInspector) {
    return !props.inspect ?
        props.children :
        <Inspector 
            header={`Form ${props.form.state.formId}`}
            infos={JSON.stringify(props.form.state, null, 4)}
        >
            {props.children}
        </Inspector>
}