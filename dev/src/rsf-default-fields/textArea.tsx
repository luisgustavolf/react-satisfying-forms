import * as React from 'react'
import { Field, FieldProps } from '../react-satisfying-forms/field';

export const TextAreaField = (props: FieldProps & React.InputHTMLAttributes<HTMLTextAreaElement>) => 
        <Field {...props}>
            {(fieldData) =>  <textarea {...fieldData}></textarea>}
        </Field>