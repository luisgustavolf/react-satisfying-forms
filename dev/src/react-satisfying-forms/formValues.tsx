import * as React from 'react'
import { FormContext } from './contexts/formContext';

export interface FormFieldsValuesProps<TData> {
    children?: (fieldsValues: TData) => React.ReactNode
}

export function FormFieldsValues<TData>(props: FormFieldsValuesProps<TData>) {
    return (
        <FormContext.Consumer>
            {(formContextValues) =>
                <React.Fragment>
                    {props.children && props.children(formContextValues.form!.fieldValues as TData)}
                </React.Fragment>
            }
        </FormContext.Consumer>
    )
}