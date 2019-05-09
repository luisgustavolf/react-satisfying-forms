import * as React from 'react'
import { FieldFactory } from '../react-satisfying-forms/field';

export const CheckboxField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input type={'checkbox'} {...props} {...fieldBindings} />
, { fCheckable: true })
