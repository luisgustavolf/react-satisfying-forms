import * as React from 'react'
import { Form, Field } from '../react-satisfying-forms';
import { delayedBobValidator } from '../react-satisfying-forms/validations/exampleValidators';

export function Validations() {
    const formRef = React.createRef<Form>();
    
    async function validate() {
        const result = await formRef.current!.validate();
        console.log(result)
    }

    async function handleSubmit() {
        console.log(await formRef.current!.submit())
    }

    return <>
    <Form ref={formRef} inspect>
        <Field fName={'name'} fExtraValidators={[delayedBobValidator]} fRequired>
            {(props) => <input {...props} />}
        </Field>
        <div>
            <button onClick={validate}>validate</button>
            <button onClick={handleSubmit}>submit</button>
        </div>
    </Form>
    </>
    
}