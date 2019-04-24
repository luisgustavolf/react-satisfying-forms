import React from "react";
import { FormContext } from "./contexts/formContext";
import { FieldGroupContext, FieldGroupContextValue } from "./contexts/fieldGroupContext";

export interface IFieldGroupProps {
    name: string
    children?: any
}

export class FieldGroup extends React.Component<IFieldGroupProps> {
    
    constructor(props: any) {
        super(props)
        this.getFieldGroupContextValue = this.getFieldGroupContextValue.bind(this);
    }
    
    getFieldGroupContextValue(parentValues: FieldGroupContextValue): FieldGroupContextValue {
        const fieldGroups = parentValues.parentChain || [];
        return {
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
                        <FieldGroupContext.Provider value={this.getFieldGroupContextValue(parentFieldGroupContext)}>
                            {this.props.children}
                        </FieldGroupContext.Provider>
                    }
                </FieldGroupContext.Consumer>
            }
        </FormContext.Consumer>
        </>        
    }
}