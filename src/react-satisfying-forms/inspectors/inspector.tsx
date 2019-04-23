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
    const now = new Date();
    const lastRender = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`

    return  <div style={{padding: 10, margin: '10px 0px', border: `1px dotted ${borderColor}`, borderRadius: 5}}>
        <div style={{marginBottom: 15, marginTop: 5, fontSize: 11}}>
            <div style={{display: 'inline-block', background: color, padding: '5px 7px',  borderRadius: 5, boxShadow: '1px 1px 2px #333'}}>
                {props.header}
            </div>
        </div>
        {props.children}
        <pre style={{backgroundColor: color, padding: 10, fontSize: 11, margin: '10px 0 0 0', borderRadius: 5}} >
            {props.infos}
            <div style={{fontSize: 9, marginTop: 10, fontStyle: 'oblique'}}>
                last render: {lastRender}
            </div>
        </pre>  
    </div>
}