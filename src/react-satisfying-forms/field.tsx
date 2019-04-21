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
    name?: string
    validators?: []
    children?: (bidings: IFieldBidings) => React.ReactNode
}

export class Field extends React.Component<IFieldProps> {
    render() {
        return <div>
            Field "{this.props.name}" do form: {this.props.form && this.props.form.state.uid} 
            //
            {this.props.children && this.props.children({})}
        </div>
    }
}