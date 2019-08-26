import React from "react";
import { Form } from "../form";

export interface FormContextValue {
    form?: Form<any>
}

export const FormContext = React.createContext<FormContextValue>({})