import * as React from 'react'
import { ContextedField, ContextedFieldProps } from "../react-satisfying-forms/contextedField";
import { Field } from '../react-satisfying-forms/field';


export const InputField = (props: React.InputHTMLAttributes<HTMLInputElement> & ContextedFieldProps) => 
        <Field {...props}>
            {(fieldData) =>  <input {...props} {...fieldData}/>}
        </Field>