import * as React from 'react'
import { Form } from './form';
import { Field } from './field';

export function SatisfyingFormExample() {
    return <>
    <Form>
        <Field>
            {() => 1}
        </Field>
        <div>
            <Field>
                {() => 2}
            </Field>
        </div>
        <div>
            <Form>
                <Field name="ok!">
                    {() => 3}
                </Field>
                <div>
                    <Field>
                        {() => 4}   
                    </Field>
                </div>
            </Form>
        </div>
    </Form>
    </>
}