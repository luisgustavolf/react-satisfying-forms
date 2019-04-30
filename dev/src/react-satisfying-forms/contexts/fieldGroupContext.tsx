import React from "react";
import { FieldGroup } from "../fieldGroup";

export interface FieldGroupContextValue {
    fieldGroup?: FieldGroup
    parentChain?: string[]
}

export const FieldGroupContext = React.createContext<FieldGroupContextValue>({})