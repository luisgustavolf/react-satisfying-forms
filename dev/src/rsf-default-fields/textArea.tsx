import * as React from 'react'
import { FieldFactory } from '../react-satisfying-forms/field';

export const TextAreaField = FieldFactory<React.InputHTMLAttributes<HTMLTextAreaElement>>((fprops, props, fieldBindings, fielStatus) => 
    <textarea {...props} {...fieldBindings}/>
)