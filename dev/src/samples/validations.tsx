import * as React from 'react'
import { Form, Field } from '../react-satisfying-forms';
import { delayedBobValidator } from '../react-satisfying-forms/validations/exampleValidators';

export function Validations() {
    const formRef = React.createRef<Form>();
    let inputRef: React.RefObject<any>;
    
    async function validate() {
        const result = await formRef.current!.validate();
        console.log(result)
    }

    async function handleSubmit() {
        console.log(await formRef.current!.submit())
    }

    return <>
    <Form ref={formRef} inspect>
        {(submit, state) => 
            <React.Fragment>
                
                <Field fName={'name'} fExtraValidators={[delayedBobValidator]}>
                    {(props) => <input {...props} />}
                </Field>
                <div>
                    <button onClick={validate}>validate</button>
                    <button onClick={handleSubmit}>submit</button>
                </div>
            </React.Fragment>
        }
    </Form>
    </>
    
}