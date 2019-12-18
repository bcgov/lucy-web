/**
 * Imports
 */
import { expect, should } from 'chai';

// Test Import
import {
    Marker,
    MarkerDecoder,
    IfMarker,
    FunctionalDecoder,
    RepeatLine,
    RepeatMarker,
    ArrayMarker,
    DataMarker,
    TemplateResolver,
    TemplateTokenResolver,
    ArrayIndexMarker,
    Encloser
} from '../templateGen';
import { valueAtKeyPath } from '../../utilities';
import { template } from '../templateReader';

describe('Test template gen', () => {
    it('should read marker', () => {
        const test = 'abvcu \n #{prop.xyz} \n bcvgqc';
        const match = test.match(Marker) || [];
        expect(match.length).to.be.greaterThan(0);
        const next = match[0].match(MarkerDecoder) || [];
        expect(next.length).to.be.greaterThan(0);
        expect(next[0]).to.be.equal('prop.xyz');

    });

    it('should read array marker', () => {
        const test = 'abcd xyz[0].lao abcd';
        const match = test.match(ArrayMarker) || [];
        expect(match.length).to.be.greaterThan(0);
        expect(match[0]).to.be.equal('xyz[0].lao');
    });

    it('should read array index marker', () => {
        const test = 'abcd xyz[index].lao abcd';
        const match = test.match(ArrayIndexMarker) || [];
        expect(match.length).to.be.greaterThan(0);
        expect(match[0]).to.be.equal('xyz[index].lao');
    });

    it('should read if template within string', () => {
        const test = '123\n #if(xyz.abc) [var x: #{prop.xyz}] \n efgh';
        const match = test.match(IfMarker) || [];
        expect(match.length).to.be.greaterThan(0);
        expect(match[0]).to.be.equal('#if(xyz.abc) [var x: #{prop.xyz}]');

        const next = match[0].match(FunctionalDecoder) || [];
        expect(next.length).to.be.greaterThan(0);
        expect(next[0]).to.be.equal('(xyz.abc)');
    });

    it('should read repeatLine template within string', () => {
        const test = '123\n #repeatLine(xyz.abc) [var x: #{prop.xyz}] \n efgh';
        const match = test.match(RepeatLine) || [];
        expect(match.length).to.be.greaterThan(0);
        expect(match[0]).to.be.equal('#repeatLine(xyz.abc) [var x: #{prop.xyz}]');

        const next = match[0].match(FunctionalDecoder) || [];
        expect(next.length).to.be.greaterThan(0);
        expect(next[0]).to.be.equal('(xyz.abc)');
    });

    it('should read repeat template within string', () => {
        const test = '123\n #repeat(xyz.abc) [var x: #{prop.xyz}] \n efgh';
        const match = test.match(RepeatMarker) || [];
        expect(match.length).to.be.greaterThan(0);
        expect(match[0]).to.be.equal('#repeat(xyz.abc) [var x: #{prop.xyz}]');

        const next = match[0].match(FunctionalDecoder) || [];
        expect(next.length).to.be.greaterThan(0);
        expect(next[0]).to.be.equal('(xyz.abc)');
    });

    it('should read DataMarker within string', () => {
        const test = '123\n hbt\n $#\n #{abc.xyz}\n lord lorem ipsum';
        const match = test.match(DataMarker) || [];
        expect(match.length).to.be.greaterThan(0);
        expect(match[0]).to.be.equal('#{abc.xyz}');
    });

    it('should read Encloser within string', () => {
        const test = `123\n vb\n [\n\n\t abcd]\n bgty\n`;
        const match = test.match(Encloser) || [];
        expect(match.length).to.be.greaterThan(0);
        expect(match[0]).to.be.equal('[\n\n\t abcd]');
    });

    it('should run data marker analyzer', () => {
        const test = '123\n hbt\n $#\n #{abc.xyz}\n lord lorem ipsum';
        const resolver: TemplateTokenResolver = {
            getValueFor: () => {
                return 'ABCD';
            }
        };
        const newVal = TemplateResolver.resolveDataMarker(test, resolver);
        expect(newVal).to.be.equal('123\n hbt\n $#\n ABCD\n lord lorem ipsum');
    });

    it('should run if marker resolver {true}', () => {
        const test = `mnm #if(abc.xyz) [lao is good boy] nnn`;
        const test2 = `\n lao is good \n $% #if(abc.ty) [some good life] $%\n **x`;
        const resolver: TemplateTokenResolver = {
            getValueFor: () => {
                return true;
            }
        };
        let newVal = TemplateResolver.resolveIfMarker(test, resolver);
        expect(newVal).to.be.equal(`mnm lao is good boy nnn`);
        newVal = TemplateResolver.resolveIfMarker(test2, resolver);
        expect(newVal).to.be.equal(`\n lao is good \n $% some good life $%\n **x`);
    });

    it('should run if marker resolver {false}', () => {
        const test = `mnm #if(abc.xyz) [lao is good boy] nnn`;
        const test2 = `\n lao is good \n $% #if(abc.ty) [some good life] $%\n **x`;
        const resolver: TemplateTokenResolver = {
            getValueFor: () => {
                return false;
            }
        };
        let newVal = TemplateResolver.resolveIfMarker(test, resolver);
        expect(newVal).to.be.equal(`mnm  nnn`);
        newVal = TemplateResolver.resolveIfMarker(test2, resolver);
        expect(newVal).to.be.equal(`\n lao is good \n $%  $%\n **x`);
    });

    it('should resolve Repeat Marker', () => {
        const nl = `\n\n\t`;
        const test = `xyz${nl} #repeat(abc, data)[\n\n#{data.x}=[\n\n\tabc = #{data.p}\n]\n\n\t\t#{lao}\n\n]\n`;
        const resolver: TemplateTokenResolver = {
            getValueFor: (key: string) => {
                return {
                    abc: [
                        { p: 'laba', x: 'gas'},
                        { p: 'Kutta', x: 'pd'}
                    ]
                }[key];
            }
        };
        const r = TemplateResolver.resolveRepeatMarker(test, resolver);
        expect(r).to.be.equal(`xyz${nl} \n\ngas=[\n\n\tabc = laba\n]\n\n\t\t#{lao}\n\n\n\npd=[\n\n\tabc = Kutta\n]\n\n\t\t#{lao}\n\n\n`);
    });

    it('should resolve template', () => {
        const test = `xyz\n\t #repeat(abc, data)[#if(laba) [#{laba.name} = #{data.p}]\n\t @Prop(#{text})\n]\n #{key}\nabc`;
        const resolver: TemplateTokenResolver = {
            getValueFor: (key: string) => {
                return valueAtKeyPath(
                    {
                        abc: [
                            { p: 'laba', x: 'gas'},
                            { p: 'Kutta', x: 'pd'}
                        ],
                        laba: {
                            name: 'Dibu'
                        },
                        text: 'aa',
                        key: 'bb',
                    },
                    key
                );
            }
        };
        const expected = `xyz\n\t Dibu = laba\n\t @Prop(aa)\nDibu = Kutta\n\t @Prop(aa)\n\n bb\nabc`;
        const actual = TemplateResolver.resolveTemplate(test, resolver);
        expect(actual).to.be.equal(expected);
    });

    it('should read sample template file', () => {
        should().exist(template('sample.ts.template'));
    });

    it('should process template', () => {
        const templateString = template('sample.ts.template');
        const resolver: TemplateTokenResolver = {
            getValueFor: (key: string) => {
                return valueAtKeyPath(
                    {
                        className: 'Test',
                        properties: [
                            {
                                type: 'number',
                                name: 'p1',
                                des: 'Value to store p1',
                            },
                            {
                                type: 'string',
                                name: 'p2',
                                des: 'Value to store p2',
                                comment: 'Line commented with if'

                            }
                        ]
                    },
                    key
                );
            }
        };
        const expected = template('expected.sample.ts.template');
        const r = TemplateResolver.resolveTemplate(templateString, resolver);
        should().exist(r);
        expect(r).to.be.equal(expected);
    });
});
