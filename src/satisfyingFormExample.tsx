import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { Field } from './react-satisfying-forms/field';
import { FieldGroup } from './react-satisfying-forms/fieldGroup';

export function SatisfyingFormExample() {
    const form1Ref = React.createRef<Form>();
    
    function submitForm1() {
        form1Ref.current!.validate();
    }

    return <>
    <Form ref={form1Ref} debug={true}>
        <Field name={'nome'} debug={false} required>
            {(props) => <input {...props} />}
        </Field>
        
        <FieldGroup name='endereco'>
            <div>
                <Field name={'logradouro'}>
                    {(props) => <input {...props} />}
                </Field>
                <Field name={'cep'}>
                    {(props) => <input {...props} />}
                </Field>
            </div>
            <FieldGroup name={'coords'}>
                <Field name={'latitude'}>
                    {(props) => <input {...props} />}
                </Field>
                <Field name={'longitude'}>
                    {(props) => <input {...props} />}
                </Field>
            </FieldGroup>
        </FieldGroup>
        <button onClick={submitForm1}>Submit</button>
        <div>teste</div>
        <div>
            <Form debug={true}>
                <Field name={'nome'}>
                    {(props) => <input {...props} />}
                </Field>
                <Field name={'logradouro'}>
                    {(props) => <input {...props} />}
                </Field>
            </Form>
        </div>
    </Form>
    </>
}