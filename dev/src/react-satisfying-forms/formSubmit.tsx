import * as React from 'react'
import { FormContext } from './contexts/formContext';

export interface FormSubmitProps {
    children?: (handleSubmit: () => void) => React.ReactNode
}

export function FormSubmit(props: FormSubmitProps) {
    return (
        <FormContext.Consumer>
            {(formContextValues) =>
                <React.Fragment>
                    {props.children && props.children(formContextValues.form!.submit)}
                </React.Fragment>
            }
        </FormContext.Consumer>
    )
}
