import * as React from 'react'
import { Field, FieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const RadioButtonField = (props: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...fProps(props)} fUseDebounce={false} fCheckable>
            {(fieldData) => 
                    <input 
                        {...notFProps(props, fieldData)}
                        type={'radio'} 
                    />
                } 
            }
        </Field>