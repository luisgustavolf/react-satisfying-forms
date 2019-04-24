import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { InputField } from './rsf-default-fields/inputField';
import { SelectField } from './rsf-default-fields/selectField';
import { TextAreaField } from './rsf-default-fields/textArea';
import { CheckboxField } from './rsf-default-fields/checkboxField';
import { RadioButtonField } from './rsf-default-fields/radioButton';

interface DTOPessoa {
    nome: string
    estrangeiro: boolean
}


export function SatisfyingFormExample() {
    function handleChange(evt: any) {
        console.log(evt);
    }
    
    const values: DTOPessoa = {
        nome: 'Jose',
        estrangeiro: false 
    }

    return <>
    <Form<DTOPessoa> inspect>
        {(submit, state) => 
            <React.Fragment>
                <div>
                    <div>Input</div>
                    <InputField fName='name' fInspect/>
                </div>
                <div>
                    <div>Select</div>
                    <SelectField fName='cities' onChange={handleChange} fInspect>
                        <option>Opt 1</option>
                        <option>Opt 2</option>
                        <option>Opt 3</option>
                    </SelectField>
                </div>
                {state.fieldValues.estrangeiro && 
                    <div>
                        <div>Descriço do pais</div>
                        <TextAreaField fName='text'/>
                    </div>
                }
                <div>
                    <div>Checkbox</div>
                    <CheckboxField fName='estrangeiro'/> Checkbox 1
                </div>

                <div>
                    <div>RadioButtons</div>
                    <RadioButtonField fName='coutry' value='brazil' fInspect/> Brazil
                    <RadioButtonField fName='coutry' value='usa' fInspect/> USA
                    <RadioButtonField fName='coutry' value='angola' fInspect/> Angola
                </div>
            </React.Fragment>
        }
    </Form>
    </>
}