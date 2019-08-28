import * as React from 'react'
import { FormContext } from './contexts/formContext';
import { ContextedField } from './contextedField';
import { IFieldBidings } from './interfaces/iFieldBidings';

export interface FieldProps { 
    name: string
    checkable?: boolean
    value?: string
    inspect?: boolean
    require?: boolean
    validations?: any[]
    children?: (fieldBindings: IFieldBidings) => any
}

export function Field(props: FieldProps) {
    return (
        <FormContext.Consumer>
            {(formContext) => 
                <ContextedField 
                    form={formContext.form!}
                    {...props}
                />
            }
        </FormContext.Consumer>
    )
}