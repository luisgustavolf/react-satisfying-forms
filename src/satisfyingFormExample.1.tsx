import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { ContextedField } from './react-satisfying-forms/contextedField';
import { FieldGroup } from './react-satisfying-forms/fieldGroup';
import { delayedBobValidator } from './react-satisfying-forms/validations/exampleValidators';
import { InputField } from './rsf-default-fields/inputField';

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

            <ContextedField fName={'name'} fInspect fRequired fExtraValidators={[delayedBobValidator]}>
                {(props) => <input {...props} />}
            </ContextedField>
            <FieldGroup name='address'>
                <div>
                    <ContextedField fName={'street'} fInspect fUseDebounce={false} fInnerFieldRef={(ref) => inputRef = ref}>
                        {(props) => <input {...props} />}
                    </ContextedField>
                    <button onClick={getFromOutside}>GetValue</button>

                    <ContextedField fName={'city'}>
                        {(props) => <input {...props} />}
                    </ContextedField>
                </div>
                <FieldGroup name={'coords'}>
                    <ContextedField fName={'latitude'}>
                        {(props) => <input {...props} />}
                    </ContextedField>
                    <ContextedField fName={'longitude'}>
                        {(props) => <input {...props} />}
                    </ContextedField>
                </FieldGroup>
            </FieldGroup>
            <button onClick={submit}>Submit</button>
            <div>teste</div>
            <div>
                <Form inspect={true}>
                    {(submit, state) => (
                        <React.Fragment>
                            <ContextedField fName={'nome'}>
                                {(props) => <input {...props} />}
                            </ContextedField>
                            <ContextedField fName={'logradouro'}>
                                {(props) => <input {...props} />}
                            </ContextedField>
                        </React.Fragment>
                    )}
                </Form>
            </div>
        </React.Fragment>
        }
    </Form>
    </>
}