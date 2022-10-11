import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
// @ts-expect-error
const domPurify = DOMPurify(window);

export default domPurify 
