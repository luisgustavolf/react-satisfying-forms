import * as React from 'react'
import { Field, FieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const InputField = (props: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...fProps(props)}>
            {(fieldData, fieldStatus) =>  
                <React.Fragment>
                    <input {...notFProps(props)} {...fieldData}/>
                    {fieldStatus.shouldDisplayErrors && fieldStatus.errors!.join(', ')}
                </React.Fragment>
            }
        </Field>