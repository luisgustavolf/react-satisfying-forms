import React from "react";
import { FormContext } from "./contexts/formContext";
import { FieldGroupContext, FieldGroupContextValue } from "./contexts/fieldGroupContext";
import { Form } from ".";

export interface FieldGroupProps {
    name: string
    children?: any
}

export class FieldGroup extends React.Component<FieldGroupProps> {
    
    constructor(props: any) {
        super(props)
        this.getFieldGroupContextValue = this.getFieldGroupContextValue.bind(this);
    }
    
    getFieldGroupContextValue(form: Form, parentFieldGroup: FieldGroupContextValue): FieldGroupContextValue {
        let fieldGroups:string[] = [];
        
        if (parentFieldGroup.form === form)
            fieldGroups = parentFieldGroup.parentChain || [];
        
        return {
            form,
            fieldGroup: this,
            parentChain: [...fieldGroups, this.props.name]  
        }
    }

    render() {
        return <>
        <FormContext.Consumer>
            {(formContext) => 
                <FieldGroupContext.Consumer>
                    {(parentFieldGroupContext) =>
                        <FieldGroupContext.Provider value={this.getFieldGroupContextValue(formContext.form!, parentFieldGroupContext)}>
                            {this.props.children}
                        </FieldGroupContext.Provider>
                    }
                </FieldGroupContext.Consumer>
            }
        </FormContext.Consumer>
        </>        
    }
}