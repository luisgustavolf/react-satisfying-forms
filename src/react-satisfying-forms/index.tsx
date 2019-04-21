import * as React from 'react'
import { Form } from './form';
import { Field } from './field';

export function SatisfyingFormExample() {
    return <>
    <Form debug={false}>
        <Field name={'nome'} debug={false}>
            {(props) => <input {...props} />}
        </Field>
        <Field name={'endereco.logradouro'}>
            {(props) => <input {...props} />}
        </Field>
        <div>teste</div>
        <div>
            <Form debug={false}>
                <Field name={'nome'} debug={false}>
                    {(props) => <input {...props} />}
                </Field>
                <Field name={'endereco.logradouro'}>
                    {(props) => <input {...props} />}
                </Field>
            </Form>
        </div>
    </Form>
    </>
}