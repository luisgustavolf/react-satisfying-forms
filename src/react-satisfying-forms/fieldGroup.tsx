import React from "react";

export interface IFieldGroupProps {
    children?: any
}

export class FieldGroup extends React.Component<IFieldGroupProps> {
    render() {
        return this.props.children
    }
}