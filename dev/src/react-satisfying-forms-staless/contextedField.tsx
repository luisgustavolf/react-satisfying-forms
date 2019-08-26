import * as React from 'react'
import { FormContext } from './contexts/formContext';
import { Field, PublicFieldProps } from './field';

export function ContextedField(props: PublicFieldProps) {
    return (
        <FormContext.Consumer>
            {(formContext) => 
                <Field 
                    fForm={formContext.form!}
                    {...props}
                />
            }
        </FormContext.Consumer>
    )
}