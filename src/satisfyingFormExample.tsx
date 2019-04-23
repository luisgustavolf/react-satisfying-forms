import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { Field } from './react-satisfying-forms/field';
import { FieldGroup } from './react-satisfying-forms/fieldGroup';
import { delayedBobValidator } from './react-satisfying-forms/validations/exampleValidators';

interface DtoPerson {
    name: string
    address: {
        street: string
        city: string
    }
}

export function SatisfyingFormExample() {
    const form1Ref = React.createRef<Form<DtoPerson>>();
    
    function handleSubmit(values: DtoPerson) {
        console.log("validations looks ok...")
        console.log(values);
    }

    return <>
    <Form<DtoPerson> ref={form1Ref} onSubmit={handleSubmit} inspect={true}>
        {(submit, state) => 
        <React.Fragment>
            <Field name={'name'} inspect required extraValidators={[delayedBobValidator]}>
                {(props) => <input {...props} />}
            </Field>
            
            <FieldGroup name='address'>
                <div>
                    <Field name={'street'} inspect useDebounce={false}>
                        {(props) => <input {...props} />}
                    </Field>
                    <Field name={'city'}>
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
            <button onClick={submit}>Submit</button>
            <div>teste</div>
            <div>
                <Form inspect={true}>
                    {(submit, state) => (
                        <React.Fragment>
                            <Field name={'nome'}>
                                {(props) => <input {...props} />}
                            </Field>
                            <Field name={'logradouro'}>
                                {(props) => <input {...props} />}
                            </Field>
                        </React.Fragment>
                    )}
                </Form>
            </div>
        </React.Fragment>
        }
    </Form>
    </>
}