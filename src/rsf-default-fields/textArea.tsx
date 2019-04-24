import * as React from 'react'
import { Field, PureFieldProps } from '../react-satisfying-forms/field';

export const TextAreaField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLTextAreaElement>) => 
        <Field {...props}>
            {(fieldData) =>  <textarea {...fieldData}></textarea>}
        </Field>