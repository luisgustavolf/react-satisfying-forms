import * as React from 'react'
import { Field, FieldProps, PureFieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const InputField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...fProps(props)}>
            {(fieldData) =>  <input {...notFProps(props)} {...fieldData}/>}
        </Field>