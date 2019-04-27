import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { FieldGroup } from './react-satisfying-forms/fieldGroup';
import { Field } from './react-satisfying-forms/field';

interface DtoPerson {
    name: string
    address: {
        street: string
        city: string
    }
}

export function SatisfyingFormExample() {
    const form1Ref = React.createRef<Form<DtoPerson>>();
    let inputRef: React.RefObject<any>;
    
    function handleSubmit(values: DtoPerson) {
        console.log("validations looks ok...")
        console.log(values);
    }

    function onChange(values: DtoPerson) {
        console.log("change...")
        console.log(values);
    }

    function getFromOutside() {
        console.log(inputRef.current.value)
    }

    const fieldValues:DtoPerson = {
        name: 'Jonh',
        address: {
            city: 'NY',
            street: 'XYZ street'
        }
    }

    return <>
    <Form>
        {(submit, state) => 
        <React.Fragment>

            <Field fName={'name'} fInspect>
                {(props) => <input {...props} />}
            </Field>
            <FieldGroup name='address'>
                <div>
                    <Field fName={'street'} fInspect fUseDebounce={false} fInnerFieldRef={(ref) => inputRef = ref}>
                        {(props) => <input {...props} />}
                    </Field>
                    <button onClick={getFromOutside}>GetValue</button>

                    <Field fName={'city'}>
                        {(props) => <input {...props} />}
                    </Field>
                </div>
                <FieldGroup name={'coords'}>
                    <Field fName={'latitude'}>
                        {(props) => <input {...props} />}
                    </Field>
                    <Field fName={'longitude'}>
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
                            <Field fName={'nome'}>
                                {(props) => <input {...props} />}
                            </Field>
                            <Field fName={'logradouro'}>
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