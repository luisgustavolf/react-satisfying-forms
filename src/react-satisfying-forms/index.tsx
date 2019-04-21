import * as React from 'react'
import { Form } from './form';
import { Field } from './field';

export function SatisfyingFormExample() {
    return <>
    <Form verbose={true}>
        <Field name={'nome'} debug={true}>
            {(props) => <input {...props} />}
        </Field>
        <div>
            <Field name={'endereco.logradouro'}>
                {(props) => <input {...props} />}
            </Field>
        </div>
        <div>
            <Form>
                <Field name="lista[2]">
                    {() => 3}
                </Field>
                <div>
                    <Field name='teste4'>
                        {() => 4}   
                    </Field>
                </div>
            </Form>
        </div>
    </Form>
    </>
}