const _ = require('lodash')

const STYLES = {
	PascalCase: function (input) {
		return _.upperFirst(_.camelCase(input))
	},
	camelCase: function (input) {
		return _.camelCase(input)
	},
	UPPERCASE: function(input) {
		return _.words(input).join('').toUpperCase()
	},
	SNAKE_CASE: function(input) {
		return _.snakeCase(input).toUpperCase()
	}
}

module.exports = {
	meta: {
		docs: {
			description: 'enforce naming enumerations consistently',
			category: 'Stylistic Issues',
		},
		schema: [
			{
				enum: Object.keys(STYLES),
				default: Object.keys(STYLES)[0]
			}
		],
	},
	create: function (context) {
		return {
			TSEnumDeclaration: function (root) {
				if (!context.options || !STYLES[context.options[0]]) {
					return null
				}

				const expectedName = STYLES[context.options[0]](root.id.name)
				if (root.id.name !== expectedName) {
					context.report({
						node: root.id,
						message: `Expected the enumeration to be named "${expectedName}".`,
					})
				}
			}
		}
	},
	test: {
		valid: [
			{
				code: `enum PascalCase {}`,
				parser: 'typescript-eslint-parser',
				parserOptions: { ecmaVersion: 6, sourceType: 'module' },
			},
			{
				code: `enum PascalCase {}`,
				options: ['PascalCase'],
				parser: 'typescript-eslint-parser',
				parserOptions: { ecmaVersion: 6, sourceType: 'module' },
			},
			{
				code: `enum camelCase {}`,
				options: ['camelCase'],
				parser: 'typescript-eslint-parser',
				parserOptions: { ecmaVersion: 6, sourceType: 'module' },
			},
			{
				code: `enum SNAKE_CASE {}`,
				options: ['SNAKE_CASE'],
				parser: 'typescript-eslint-parser',
				parserOptions: { ecmaVersion: 6, sourceType: 'module' },
			},
		],
		invalid: [
			{
				code: `enum SNAKE_CASE {}`,
				options: ['PascalCase'],
				parser: 'typescript-eslint-parser',
				parserOptions: { ecmaVersion: 6, sourceType: 'module' },
				errors: [{ message: 'Expected the enumeration to be named "SnakeCase".' }],
			},
		]
	}
}
