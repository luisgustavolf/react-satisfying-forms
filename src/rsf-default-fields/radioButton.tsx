import * as React from 'react'
import { Field, PureFieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const RadioButtonField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...fProps(props)} fUseFormStateValue fUseDebounce={false}>
            {(fieldData) => {
                return <input 
                    {...notFProps(fieldData, props)}
                    type={'radio'} 
                    checked={fieldData.value === props.value}
                    />
                } 
            }
        </Field>