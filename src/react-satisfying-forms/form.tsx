import * as React from 'react'
import { Field } from './field';
import { FieldGroup } from './fieldGroup';

export interface IFormProps {
    children?: React.ReactNodeArray
}

export interface IFormState {
    uid?: string
}

export class Form extends React.Component<IFormProps> {
    static formCount: number = 1
    
    state: Readonly<IFormState> = {
        uid: (Form.formCount++).toString()
    }

    constructor(props: IFormProps) {
        super(props);
    }

    rebuildTree(children: any): React.ReactNode {
        if (Array.isArray(children)) {
            return children.map((node: any) => {
                return this.rebuildTree(node);
            })
        } else {
            if(children.type == Field) {
                return this.rebuildField(children)
            } else if (children.type == FieldGroup) {
                return this.rebuildFieldGroup(children)
            } else if (children.type == Form) {
                return this.rebuildForm(children)
            } else if (children && children.props && children.props.children) {
                return this.rebuildTree(children.props.children);
            } else {
                return children
            }
        }
    }

    rebuildField(node: any): React.ReactNode {
        console.log('rebuild')
        return React.cloneElement(node, { key: Math.random(), form: this });
    }

    rebuildFieldGroup(node: any): React.ReactNode {
        return node;
    }

    rebuildForm(node: any): React.ReactNode {
        return node;
    }
    

    componentWillUpdate() {
        console.time(`form-update ${this.state.uid}`)
    }

    componentDidUpdate() {
        console.timeEnd(`form-update ${this.state.uid}`)
    }

    componentWillMount() {
        console.time(`form-mount ${this.state.uid}`)
    }

    componentDidMount() {
        console.timeEnd(`form-mount ${this.state.uid}`)
        
    }

    render () {
        return this.rebuildTree(this.props.children)
    }
}