/**
 * Test File For json utility
 */
import { expect } from 'chai';
import {
    prettyJSON, flatJSON, flatString
} from './json.utility';
describe('Test json utility', () => {
    it('should return pretty json', () => {
        const test = {
            x: 'x',
            y: 'y',
            xy: {
                xx: 'xx',
                yy: 'yy'
            },
            yx: [ 'xx', 'yy'],
            z: 0
        };
        const r = prettyJSON(test);
        const ex = JSON.stringify(test, null, 2);
        expect(r).to.be.equal(ex);
    });
    it('should return flat string', () => {
        const data = {
            x : {
                a: 'a',
                b: 'b'
            },
            y: 'y',
            z: 11,
            zz: {
                n: {
                    nn: 'nn',
                    mm: 'mm'
                },
                m: 'm'
            },
            a: ['1', '2', '3'],
        };
        const r = 'a,b,y,11,nn,mm,m,1,2,3';
        expect(flatString(data)).to.be.equal(r);
    });
    it('should create flat json struct', () => {
        const data = {
            x : {
                a: 'a',
                b: 'b'
            },
            y: 'y',
            z: 11,
            zz: {
                n: {
                    nn: 'nn',
                    mm: 'mm'
                },
                m: 'm'
            },
            a: [
                {
                    x: 1,
                    y: 2
                },
                {
                    x: 7,
                    y: 8
                }
            ]
        };
        const expected = {
            'x.a': 'a',
            'x.b': 'b',
            y: 'y',
            z: 11,
            'zz.n.nn': 'nn',
            'zz.n.mm': 'mm',
            'zz.m': 'm',
            a: '(1,2),(7,8)'
        };
        expect(flatJSON(data)).to.be.eql(expected);
    });
});
// ------------------------------------
