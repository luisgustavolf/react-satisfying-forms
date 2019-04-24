import * as React from 'react'
import { Field, FieldProps, PureFieldProps } from '../react-satisfying-forms/field';

export const SelectField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLSelectElement>) => 
        <Field {...props}>
            {(fieldData) =>  <select {...props} {...fieldData}/>}
        </Field>