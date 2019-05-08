import React from "react";
import { FieldGroup } from "../fieldGroup";
import { Form } from "../form";

export interface FieldGroupContextValue {
    form?: Form
    fieldGroup?: FieldGroup
    parentChain?: string[]
}

export const FieldGroupContext = React.createContext<FieldGroupContextValue>({})