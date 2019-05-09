import * as React from 'react'
import { Form } from '../react-satisfying-forms';
import { FieldFactory, FieldFactoryArgs } from '../react-satisfying-forms/field';

const InputField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input {...props} {...fieldBindings} />
)

export function BakeFields() {
    return <>
        <Form>
            <InputField fName={'name'}/>
        </Form>
    </>
    
}