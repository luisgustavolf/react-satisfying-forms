import * as React from 'react'

export interface IInspectorProps {
    header: React.ReactNode
    infos: React.ReactNode
    color?: string
    boderColor?: string
    children?: any
}

export function Inspector(props: IInspectorProps) {
    const color = props.color || "#eee";
    const borderColor = props.boderColor || "#ccc";

    return  <div style={{padding: 10, margin: '10px 0px', border: `1px dotted ${borderColor}`, borderRadius: 5}}>
        <div style={{marginBottom: 15, marginTop: 5, fontSize: 11}}>
            <span style={{background: color, padding: 5,  borderRadius: 5}}>
                {props.header}
            </span>
        </div>
        {props.children}
        <pre style={{backgroundColor: color, padding: 10, fontSize: 11, margin: '10px 0 0 0', borderRadius: 5}} >
            {props.infos}
        </pre>  
    </div>
}