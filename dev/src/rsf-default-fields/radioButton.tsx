import * as React from 'react'
import { FieldFactory } from '../react-satisfying-forms/field';

export const RadioField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input type={'radio'} {...props} {...fieldBindings} />
, { fCheckable: true })
