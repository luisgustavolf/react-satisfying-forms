import { fProps, notFProps } from "./field";

describe('Props handling', () => {

    it('Returns new object only with fProps', () => {
        const objA = {
            a: 'a',
            fProp1: 'fProp1',
            fProp2: 'fProp2',
            c: 'c',
            fan: []
        }

        const objB = {
            fProp3: 'fProp3',
            d: 'd'
        }

        const objWFprops = fProps(objA, objB);
        expect(objWFprops).toEqual({ fProp1: 'fProp1', fProp2: 'fProp2', fProp3: 'fProp3' })
    }) 

    it('Returns new object with no fProps', () => {
        const objA = {
            a: 'a',
            fProp1: 'fProp1',
            fProp2: 'fProp2',
            c: 'c',
            fan: [],
            d: 'd1'
        }

        const objB = {
            fProp3: 'fProp3',
            d: 'd'
        }

        const objWFprops = notFProps(objA, objB);
        expect(objWFprops).toEqual({ a: 'a', c: 'c', fan: [], d: 'd' })
    }) 
})

export default {}
