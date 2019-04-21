import * as React from 'react'
import { Form } from './form';

export interface IFieldBidings {
    value?: any
    errors?: string[]
    touched?: boolean
    dirty?: boolean
    onClick?: (value: any) => void
    onBlur?: (value: any) => void
    onFocus?: (value: any) => void
    onChange?: (value: any) => void
}

export interface IFieldProps {
    form?: Form // injected by the owner form
    name: string
    value?: any
    validators?: []
    debug?: boolean
    children?: (bidings: IFieldBidings) => React.ReactNode
}

export class Field extends React.Component<IFieldProps> {
    
    constructor(props: any) {
        super(props)
        this.onChange = this.onChange.bind(this);
    }
    
    onChange(evt: any) {
        const value = evt.target ? evt.target.value : evt
        this.props.form!.updateFieldValue(this.props.name, value)
    }

    renderDebugInfo(fieldBidings: IFieldBidings) {
        return <pre style={{backgroundColor: "#eee", padding: 10}} >
            {JSON.stringify(fieldBidings, null, 4)}
        </pre>
    }

    render() {
        const fieldData = this.props.form!.getFieldData(this.props.name)
        const fieldBidings: IFieldBidings = {
            value: this.props.value,
            onChange: this.onChange,
        }

        return <React.Fragment>
                {this.props.children && this.props.children(fieldBidings)}
                {this.props.debug && this.renderDebugInfo(fieldBidings)}
            </React.Fragment>
    }
}