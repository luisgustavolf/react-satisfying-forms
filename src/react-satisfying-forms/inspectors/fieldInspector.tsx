import * as React from 'react'
import { ContextedField } from '../contextedField';
import { Inspector } from './inspector';

export interface IFieldInspector {
    inspect: boolean
    field: ContextedField
    children?: any
}

export function FieldInspector(props: IFieldInspector) {
    return !props.inspect ?
        props.children :
        <Inspector 
            header={`Field ${props.field.getFullName()}`}
            infos={JSON.stringify({useDebouce: props.field.props.fUseDebounce, ...props.field.getFieldData()}, null, 4)}
            color={"#dbf0fd"}
            boderColor={"#7e56ff"}
        >
            {props.children}
        </Inspector>
}