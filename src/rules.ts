import type { Rule } from './types';

const patchStartComment = '// The following lines have been added by unleashed-typescript';
const patchEndComment = '// End of unleashed-typescript additions';

export const rules: Rule[] = [
  {
    file: 'typescript.js',
    replace: [
      {
        description: 'Remove all internal tags.',
        pattern: /\* *@internal *\*/gm,
        value: '* internal tag removed by unleashed-typescript *',
      },
      {
        description: 'Exports private type checking methods.',
        pattern: 'isTypeAssignableTo: isTypeAssignableTo,',
        value: [
          'isTypeAssignableTo: isTypeAssignableTo,',
          patchStartComment,
          'isTypeSubtypeOf: isTypeSubtypeOf,',
          'isTypeIdenticalTo: isTypeIdenticalTo,',
          'isTypeDerivedFrom: isTypeDerivedFrom,',
          'isTypeComparableTo: isTypeComparableTo,',
          'areTypesComparable: areTypesComparable,',
          patchEndComment,
        ].join('\n            '),
      },
    ],
  },
  {
    file: 'typescript.d.ts',
    replace: [
      {
        description: 'Exports private type checking types.',
        pattern: 'export interface TypeChecker {',
        value: [
          'export interface TypeChecker {',
          patchStartComment,
          'isTypeSubtypeOf(source: Type, target: Type): boolean;',
          'isTypeIdenticalTo(source: Type, target: Type): boolean;',
          'isTypeDerivedFrom(source: Type, target: Type): boolean;',
          'isTypeAssignableTo(source: Type, target: Type): boolean;',
          'isTypeComparableTo(source: Type, target: Type): boolean;',
          'areTypesComparable(source: Type, target: Type): boolean;',
          patchEndComment,
        ].join('\n        '),
      },
    ],
  },
];
