import * as React from 'react'
import { Field, PureFieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const CheckboxField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...fProps(props)} fUseDebounce={false} fCheckable>
            {(fieldBindings, fieldStatus) =>  
                <input 
                    {...notFProps(props, fieldBindings)}
                    type={'checkbox'} 
                />
            }
        </Field>