import * as React from 'react'
import { IFormValues } from './interfaces/iFormValues';
import { FormContext } from './contexts/formContext';

export interface FormProps<TFielValues> {
    values?: IFormValues<TFielValues>
    inspect?: boolean
    onChange?: (formValues: IFormValues<TFielValues>) => void
    onSubmit?: () => void
}

export class Form<TFielValues> extends React.Component<FormProps<TFielValues>> {
    
    getIsChecked(propName: string, checkValue: string): boolean | undefined {
        return undefined    
    }

    getValue(propName: string) {

    }
    
    render() {
        return (
            <FormContext.Provider value={{ form: this }} >
                {this.props.children}
                {this.props.inspect && 
                    <div>INSPECTOR</div>
                }
            </FormContext.Provider>
        );
    }
}