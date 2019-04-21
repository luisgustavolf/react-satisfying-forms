import React from "react";

export interface IFieldGroupProps {
    name: string
    children?: any
}

export class FieldGroup extends React.Component<IFieldGroupProps> {
    render() {
        return this.props.children
    }
}