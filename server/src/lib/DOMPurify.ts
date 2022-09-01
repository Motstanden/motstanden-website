import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
// @ts-expect-error
const domPurify = DOMPurify(window);

export default domPurify 
