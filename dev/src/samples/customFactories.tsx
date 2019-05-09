import * as React from 'react'
import { Form } from '../react-satisfying-forms';
import { FieldFactory, FieldFactoryArgs } from '../react-satisfying-forms/field';

interface MyFieldFactoryProps {
    fLabel?: string
}

function MyFieldFactory<TProps>(field: FieldFactoryArgs<TProps>) {
    return FieldFactory<TProps, MyFieldFactoryProps>((fprops, props, fieldBindings, fielStatus) => 
            <div>
                <div>{fprops.fLabel}</div>
                <div>
                    {field(fprops, props, fieldBindings, fielStatus)}
                </div>
                <div>
                    {fielStatus.shouldDisplayErrors && fielStatus.errors}
                </div>
            </div>
        )
    
}

const InputField = MyFieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input {...props} {...fieldBindings} />
)

export function CustomFactories() {
    return <>
        <Form inspect>
            <InputField fLabel={'label'} fName={'name'} fInspect fRequired/>
        </Form>
    </>
    
}