import * as React from 'react'
import { Field, FieldProps } from '../react-satisfying-forms/field';

export const InputField = (props: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...props}>
            {(fieldData) =>  <input {...props} {...fieldData}/>}
        </Field>