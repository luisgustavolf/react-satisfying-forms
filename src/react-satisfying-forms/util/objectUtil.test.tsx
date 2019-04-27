import { flattenObject } from "./objectUtil";

it ('Flats object correctly', () => {
    const obj = {
        a: 'a',
        b: 'b',
        c: {
            c1: 'c1',
            c2: {
                c21: 'c21'
            }
        },
        d: 'd'
    }

    const flatted = flattenObject(obj);
    expect(flatted).toEqual({ 
        'a': 'a',
        'b': 'b',
        'c.c1': 'c1',
        'c.c2.c21': 'c21',
        'd': 'd'
    })
})

export default {}