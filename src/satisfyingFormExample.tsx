import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { ContextedField } from './react-satisfying-forms/contextedField';
import { InputField } from './rsf-default-fields/inputField';
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

    const Comp = () => 
        <ContextedField name={'name2'} inspect>
            {(props) => <input {...props} />}
        </ContextedField>

    return <>
    <Form inspect>
        {(submit, state) => 
            <React.Fragment>
                <Field name={'city'}>
                    {(props) => <input {...props} />}
                </Field>
            </React.Fragment>
        }
    </Form>
    </>
}