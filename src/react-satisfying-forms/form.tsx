import * as React from 'react'
import { Field } from './field';
import { FieldGroup } from './fieldGroup';
import { Map } from 'immutable';
import { IFieldData } from './interface/iFieldData';

export interface IFormProps {
    children?: React.ReactNodeArray
    verbose?: boolean
}

export interface IFormState<TData> {
    formId: string
    fieldValues: TData
}

export class Form<TData extends Object = {}> extends React.Component<IFormProps> {
    static formCount: number = 0
    private fieldCount: number = 0
    private formId: string;
    private rebuildCounter: number = 0;

    state: Readonly<IFormState<TData>> = {
        formId: (Form.formCount++).toString(),
        fieldValues: {} as TData
    }

    constructor(props: IFormProps) {
        super(props);
        this.formId = (Math.random() * 100000).toFixed(0).toString()
    }

    ///////////////////////////////////////////////////////////
    // Tree Build

    rebuildTree(children: any): React.ReactNode {
        this.fieldCount = 0;
        this.rebuildCounter++
        return this.transferseTree(children);
    }

    transferseTree(children: any): React.ReactNode {
        if (Array.isArray(children)) {
            return children.map((node: any, index: number) => {
                return <React.Fragment key={index}>{this.rebuildTree(node)}</React.Fragment>;
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
        console.log(this.formId)
        const fieldData = this.getFieldData(node.props.name)
        return React.cloneElement(node, { form: this, value: fieldData.value || '' });
    }

    rebuildFieldGroup(node: any): React.ReactNode {
        return node;
    }

    rebuildForm(node: any): React.ReactNode {
        return node;
    }
    
    ///////////////////////////////////////////////////////////
    // Tree Build

    updateFieldValue(name: string, value: any) {
        const newState = Map(this.state.fieldValues as any).set(name, value);
        this.setState((prevState) => ({ fieldValues:  newState.toObject() }))
    }

    getFieldData(name: string): IFieldData {
        const stateMap = Map(this.state.fieldValues as any);
        return {
            value: stateMap.get(name)
        }
    }

    componentWillUpdate() {
        console.time(`form-update ${this.state.formId}`)
    }

    componentDidUpdate() {
        console.timeEnd(`form-update ${this.state.formId}`)
    }

    componentWillMount() {
        console.time(`form-mount ${this.state.formId}`)
    }

    componentDidMount() {
        console.timeEnd(`form-mount ${this.state.formId}`)
        
    }

    renderVerboseInfo() {
        return <pre style={{backgroundColor: "#eee", padding: 10}} >
            {JSON.stringify(this.state, null, 4)}
        </pre>
    }

    render () {
        return <>
            {this.rebuildTree(this.props.children)}
            {this.props.verbose && this.renderVerboseInfo()}
        </>
    }
}