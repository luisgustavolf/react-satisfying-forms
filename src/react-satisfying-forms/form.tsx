import * as React from 'react'
import { Field } from './field';
import { FieldGroup } from './fieldGroup';
import * as OPath from 'object-path';
import { FieldState } from './interfaces/fieldData';
import { FieldStatus } from './interfaces/fieldStatus';
import { FormInspector } from './inspectors/formInspector';
import { IFormFieldValues } from './interfaces/iFormFieldValues';
import { FormStatus } from './interfaces/formStatus';

export interface IFormProps<TData = {}> {
    inspect?: boolean
    onSubmit?: (fieldValues: TData) => void
    children?: (handleSubmit: () => void, state: IFormState<TData>) => React.ReactNode
}

export interface IFormState<TData> extends IFormFieldValues<TData> {
    formId: string
    fieldStatus: { [fieldName: string]: FieldStatus }
    formStatus: FormStatus
    isValidating: boolean
}

export class Form<TData extends Object = {}, TProps extends Object = {}, TState extends Object = {}> 
        extends React.Component<IFormProps<TData> & TProps, IFormState<TData> & TState> {
    
    static formCount: number = 0
    private fieldGroupsEntered: string[] = []
    private fieldRefs: React.RefObject<Field>[] = []
    private validationCounter: number = 0

    state: Readonly<IFormState<TData> & TState> = {
        ...this.state,
        formId: (Form.formCount++).toString(),
        fieldValues: {} as TData,
        fieldStatus: {},
        formStatus: {},
        isValidating: false
    }

    ///////////////////////////////////////////////////////////
    // Tree search & rebuild

    constructor(props: any) {
        super(props);
        this.submit = this.submit.bind(this);
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

    private setFieldStatus(fieldName: string, prop: string, value: any) {
        const fieldStats = OPath.get(this.state.fieldStatus, `${fieldName}.${prop}`)
        
        if (fieldStats == value)
            return

        this.setState((prevState) => { 
            const newFormStatus = this.updateFormStatusAfterFieldStatusChange({...prevState.formStatus}, prop, value)
            
            OPath.set(prevState.fieldStatus, `${fieldName}.${prop}`, value)
            return { 
                formStatus: { ...prevState.formStatus, ...newFormStatus },
                fieldStatus:  { ...prevState.fieldStatus }
            }
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
            this.setState((prevState) => { 
                OPath.set(prevState.fieldValues, fieldName, value)
                return { fieldValues:  {...prevState.fieldValues }}
            }, () => {
                this.setFieldDirty(fieldName);
                resolve()
            })
        })
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

    /////////////////////////////////////////////////////////
    // Validations

    async validate() {
        const validators = this.fieldRefs.map((fRef) => fRef.current!.validate())
        await Promise.all(validators);
        return this.fieldRefs.filter((ref) => { 
            const fieldData = ref.current!.getFieldData()
            return fieldData.errors && fieldData.errors.length
        }).map((ref) => { return ref.current!.getFieldData() })
    }

    /////////////////////////////////////////////////////////
    // Form Status

    updateFormStatusAfterFieldStatusChange(prevFormStatus: FormStatus, fieldProp: any, fieldValue: any) {
        const formStatus = this.getFormStatus();
        let newFormStatus:FormStatus = {...prevFormStatus}
            
        if (fieldProp == 'dirty') {
            newFormStatus.dirty = true
        } else if (fieldProp == 'isValidating') {
            fieldValue === true ? this.validationCounter++ : this.validationCounter--

            newFormStatus.hasValidated = true
            newFormStatus.isValidating = this.validationCounter > 0
            newFormStatus.hasErros = formStatus.hasErros
        }

        return newFormStatus
    }

    getFormStatus() {
        let status:FormStatus = {}
        
        for (let i = 0; i < this.fieldRefs.length; i++) {
            const fieldData = this.fieldRefs[i].current!.getFieldData();
            status.isValidating = status.isValidating || fieldData.isValidating
            status.dirty = status.dirty || fieldData.dirty
            status.hasErros = status.hasErros || (fieldData.errors && fieldData.errors.length ? true : false)
        } 

        return status
    }

    async submit() {
        console.log(this.getFormStatus())

        if (this.state.formStatus.isValidating)
            return;
        else if (!this.state.formStatus.hasValidated)
            await this.validate();
        else if (!this.state.formStatus.hasErros && this.props.onSubmit)
            this.props.onSubmit(this.state.fieldValues)

    }

    /////////////////////////////////////////////////////////
    // Render events

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

    /////////////////////////////////////////////////////////
    // Render methods

    /**
     * When using inheritance, use this method as a replace
     * for the defaults 'render'.
     */
    renderFields():React.ReactNode {
        return <React.Fragment />
    }

    render () {
        return <>
            <FormInspector form={this as Form} inspect={!!this.props.inspect}>
                {this.rebuildTree(
                    <React.Fragment>
                        {this.props.children && this.props.children!(this.submit, this.state)}
                        {this.renderFields()}
                    </React.Fragment>)}
            </FormInspector>
        </>
    }
}