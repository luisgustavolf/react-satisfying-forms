import Adapter from 'enzyme-adapter-react-16';
import { configure } from "enzyme";

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

describe('Validation Helper cases', () => { 
    it.todo('Validates all fields')
    it.todo('Validates a specific field')
})

export default {}