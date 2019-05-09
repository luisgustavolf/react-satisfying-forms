import * as React from 'react'
import { FieldFactory } from '../react-satisfying-forms/field';

export const InputField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input {...props} {...fieldBindings} />
)