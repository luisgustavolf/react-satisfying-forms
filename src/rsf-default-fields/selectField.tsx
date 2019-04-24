import * as React from 'react'
import { Field, FieldProps, PureFieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const SelectField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLSelectElement>) => 
        <Field {...fProps(props)}>
            {(fieldData) =>  <select {...notFProps(fieldData)} children={props.children}/>}
        </Field>