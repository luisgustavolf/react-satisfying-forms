import { ContextedFieldProps, ContextedField } from "../contextedField";
import * as React from "react";

export function DefaultFieldFactory<TFieldProps>(InnerField: (props: TFieldProps) => React.ReactComponentElement<any, any>) {
    return (props: TFieldProps & ContextedFieldProps) => 
        <ContextedField {...props}>
            {(fieldData) =>  <InnerField {...props} {...fieldData}></InnerField>}
        </ContextedField>
}