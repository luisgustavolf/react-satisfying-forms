import { fProps, notFProps } from "./field";

describe('Props handling', () => {

    it('Returns new object only with fProps', () => {
        const obj = {
            a: 'a',
            fProp1: 'fProp1',
            fProp2: 'fProp2',
            c: 'c',
            fan: []
        }

        const objWFprops = fProps(obj);
        expect(objWFprops).toEqual({ fProp1: 'fProp1', fProp2: 'fProp2' })
    }) 

    it('Returns new object with no fProps', () => {
        const obj = {
            a: 'a',
            fProp1: 'fProp1',
            fProp2: 'fProp2',
            c: 'c',
            fan: []
        }

        const objWFprops = notFProps(obj);
        expect(objWFprops).toEqual({ a: 'a', c: 'c', fan: [] })
    }) 
})

export default {}
