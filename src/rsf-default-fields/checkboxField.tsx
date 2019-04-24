import * as React from 'react'
import { Field, FieldProps } from '../react-satisfying-forms/field';

export const CheckboxField = (props: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) => 
        <Field {...props}>
            {(fieldData) =>  <input 
                {...props} 
                {...fieldData} 
                type={'checkbox'} 
                onChange={(evt) => fieldData.onChangeValue!(evt.target.checked) }
                checked={fieldData.value === true}/>}
        </Field>