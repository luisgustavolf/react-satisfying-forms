import * as React from 'react'
import { FormContext } from './contexts/formContext';
import { ContextedField } from './contextedField';
import { IFieldBidings } from './interfaces/iFieldBidings';
import { IFieldValidator } from './interfaces/iFieldValidator';

export interface FieldProps { 
    name: string
    initialValue?: any
    checkable?: boolean
    checkedValue?: any
    value?: string
    inspect?: boolean
    require?: boolean
    disabled?: boolean
    validators?: IFieldValidator[]
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