import * as React from 'react'
import { FormContext } from './contexts/formContext';
import * as Form from './form'

export interface FormStateProps<TData> {
    children?: (state: Form.FormState<TData>) => React.ReactNode
}

export function FormState<TData>(props: FormStateProps<TData>) {
    return (
        <FormContext.Consumer>
            {(formContextValues) =>
                <React.Fragment>
                    {props.children && props.children(formContextValues.form!.state as Form.FormState<TData>)}
                </React.Fragment>
            }
        </FormContext.Consumer>
    )
}
