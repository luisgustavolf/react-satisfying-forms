import * as React from 'react'
import { Form, FieldGroup } from '../react-satisfying-forms';
import { CheckboxField } from '../rsf-default-fields/checkboxField';
import { InputField } from '../rsf-default-fields/inputField';

export function SetFieldValues() {
    const formRef = React.useRef<Form>(null);
    
    function handleChange(evt: any) {
        console.log(evt)
    }

    function handleClick() {
        if (formRef.current)
            formRef.current.setFieldValue('group', {
                subitem: 'value',
                subitem2: 'value2',
            })
    }

    function onMount() {
        if (formRef.current)
            formRef.current.setFieldsValues({
                test: 'test value',
                group: null
            })
    }

    React.useEffect(() => { onMount() }, []);

    return (
        <Form ref={formRef} inspect>
            <InputField fName={'test'}/>
            <FieldGroup name={'group'}>
                <InputField fName={'subitem'}/>
            </FieldGroup>
            <button onClick={handleClick}>Set values</button>
        </Form>
    )
}