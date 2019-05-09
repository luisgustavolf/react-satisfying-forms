import * as React from 'react'
import { FieldFactory } from '../react-satisfying-forms/field';

export const SelectField = FieldFactory<React.InputHTMLAttributes<HTMLSelectElement>>((fprops, props, fieldBindings, fielStatus) => 
    <select {...props} {...fieldBindings} children={props.children}/>
)
