import * as React from 'react'
import { Form } from '../react-satisfying-forms/form';
import { FieldGroup } from '../react-satisfying-forms/fieldGroup';
import { Field } from '../react-satisfying-forms/field';

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

    function validate() {
        form1Ref.current!.validate()
    }

    const fieldValues:DtoPerson = {
        name: 'Jonh',
        address: {
            city: 'NY',
            street: 'XYZ street'
        }
    }

    return <>
    <Form ref={form1Ref}>
            <button onClick={validate}>validate</button>
            <Field fName={'name'} fRequired>
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
            
            <Form.Submit>
                {(submit) => 
                    <button onClick={submit}>Submit</button>
                }    
            </Form.Submit>
            
            <div>teste</div>
            <div>
                <Form inspect={true}>
                    <Field fName={'nome'}>
                        {(props) => <input {...props} />}
                    </Field>
                    <Field fName={'logradouro'}>
                        {(props) => <input {...props} />}
                    </Field>
                </Form>
            </div>
    </Form>
    </>
}