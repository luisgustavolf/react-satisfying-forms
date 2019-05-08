import * as React from 'react'
import { Field, PureFieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const RadioButtonField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...fProps(props)} fUseDebounce={false} fIsCheckable>
            {(fieldData) => 
                    <input 
                        {...notFProps(props, fieldData)}
                        type={'radio'} 
                    />
                } 
            }
        </Field>