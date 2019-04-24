import * as React from 'react'
import { FormContext } from './contexts/formContext';
import { FieldGroupContext } from './contexts/fieldGroupContext';
import { ContextedField, ContextedFieldProps } from './contextedField';

export interface FieldProps extends ContextedFieldProps { }

export const Field = React.forwardRef<ContextedField, FieldProps>((props, ref) =>
    <FormContext.Consumer>
        {(formContextValues) =>
            <FieldGroupContext.Consumer>
                {(fieldGruopContextValues) =>
                    <ContextedField
                        ref={ref}
                        form={formContextValues.form}
                        fieldGroups={fieldGruopContextValues.parentChain}
                        {...props}
                    />
                }
            </FieldGroupContext.Consumer>
        }
    </FormContext.Consumer>
)