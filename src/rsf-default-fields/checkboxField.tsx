import * as React from 'react'
import { Field, PureFieldProps, fProps, notFProps } from '../react-satisfying-forms/field';

export const CheckboxField = (props: PureFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...fProps(props)} fUseDebounce={false}>
            {(fieldData) =>  <input 
                {...notFProps(fieldData, props)}
                type={'checkbox'} 
                onChange={(evt) => fieldData.onChange!(evt.target.checked) }
                checked={fieldData.value === true}/>}
        </Field>