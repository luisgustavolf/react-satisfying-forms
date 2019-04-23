import * as React from 'react'
import { Field } from './field';
import { FieldGroup } from './fieldGroup';
import * as OPath from 'object-path';
import { FieldState } from './interfaces/fieldData';
import { FieldStatus } from './interfaces/fieldStatus';
import { FormInspector } from './inspectors/formInspector';

export interface IFormProps {
    inspect?: boolean
    children?: React.ReactNodeArray
}

export interface IFormState<TData> {
    formId: string
    fieldValues: TData
    fieldStatus: { [fieldName: string]: FieldStatus }
}

export class Form<TData extends Object = {}> extends React.Component<IFormProps> {
    
    static formCount: number = 0
    private fieldGroupsEntered: string[] = []
    private fieldRefs: React.RefObject<Field>[] = []

    state: Readonly<IFormState<TData>> = {
        formId: (Form.formCount++).toString(),
        fieldValues: {} as TData,
        fieldStatus: {}
    }

    ///////////////////////////////////////////////////////////
    // Tree search & rebuild

    private rebuildTree(children: any) {
        this.fieldRefs = []
        return this.transferseTree(children);
    }

    private transferseTree(children: any): React.ReactNode {
        if (Array.isArray(children)) {
            return children.map((node: any, index: number) => {
                return <React.Fragment key={index}>{this.transferseTree(node)}</React.Fragment>;
            })
        } else {
            if(children.type == Field) {
                return this.rebuildField(children)
            } else if (children.type == Form) {
                return this.rebuildForm(children) 
            } else if (children.type == FieldGroup) {
                return this.rebuildFieldGroup(children);
            } else if (children && children.props && children.props.children) {
                return React.cloneElement(children, {}, this.transferseTree(children.props.children));
            } else {
                return children
            }
        }
    }

    private rebuildField(node: any): React.ReactNode {
        const ref = React.createRef<Field>();
        this.fieldRefs.push(ref);
        const novoNo =  React.cloneElement(node, { 
            ref: ref,
            form: this, 
            fieldGroups: [...this.fieldGroupsEntered]
        });
        return novoNo
    }

    private rebuildFieldGroup(node: any): React.ReactNode {
        this.fieldGroupsEntered.push(node.props.name)
        const fieldGroup = React.cloneElement(node, {}, this.transferseTree(node.props.children));
        this.fieldGroupsEntered.pop()
        return fieldGroup;
    }

    private rebuildForm(node: any): React.ReactNode {
        return node;
    }
    
    ///////////////////////////////////////////////////////////
    // Props manipulation

    setFieldStatus(fieldName: string, prop: string, value: any) {
        const fieldStats = OPath.get(this.state.fieldStatus, `${fieldName}.${prop}`)

        if (fieldStats == value)
            return

        this.setState((prevState:IFormState<TData>) => { 
            OPath.set(prevState.fieldStatus, `${fieldName}.${prop}`, value)
            return { fieldStatus:  {...prevState.fieldStatus }}
        })
    }

    setFieldTouched(fieldName: string) {
        this.setFieldStatus(fieldName, 'touched', true)
    }

    setFieldDirty(fieldName: string) {
        this.setFieldStatus(fieldName, 'dirty', true)
    }

    setFieldErros(fieldName: string, errors: (string | undefined)[]) {
        this.setFieldStatus(fieldName, 'errors', errors)
    }

    setFieldValidating(fieldName: string, isValidating: boolean) {
        this.setFieldStatus(fieldName, 'isValidating', isValidating)    
    }

    async setFieldValue(fieldName: string, value: any) {
        return new Promise((resolve) => {
            this.setState((prevState:IFormState<TData>) => { 
                OPath.set(prevState.fieldValues, fieldName, value)
                return { fieldValues:  {...prevState.fieldValues }}
            }, () => {
                this.setFieldDirty(fieldName);
                resolve()
            })
        })
    }

    async validate() {
        const validators = this.fieldRefs.map((fRef) => fRef.current!.validate())
        return await Promise.all(validators);
    }

    getFieldValue(name: string): any {
        return OPath.get(this.state.fieldValues, name);
    }

    getFieldData(name: string): FieldState {
        return {
            ...OPath.get(this.state.fieldStatus, name),
            value: this.getFieldValue(name)
        }
    }

    componentWillUpdate() {
        if (this.props.inspect)
            console.time(`Form#${this.state.formId} update`)
    }

    componentDidUpdate() {
        if (this.props.inspect)
            console.timeEnd(`Form#${this.state.formId} update`)
    }

    componentWillMount() {
        if (this.props.inspect)
            console.time(`Form#${this.state.formId} mount`)
    }

    componentDidMount() {
        if (this.props.inspect)
            console.timeEnd(`Form#${this.state.formId} mount`)
    }

    /**
     * When using inheritance, use this method as a replace
     * for the defaults 'render'.
     */
    renderFields():React.ReactNode {
        return <React.Fragment />
    }

    render () {
        return <>
            <FormInspector form={this} inspect={!!this.props.inspect}>
                {this.rebuildTree(
                    <React.Fragment>
                        {this.props.children}
                        {this.renderFields()}
                    </React.Fragment>)}
            </FormInspector>
        </>
    }
}