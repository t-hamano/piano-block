module.exports = {
	extends: [
		'@wordpress/stylelint-config/scss',
		'stylelint-config-recess-order',
	],
	rules: {
		"no-descending-specificity": null,
		"font-weight-notation": null,
		"selector-class-pattern": null,
	}
}
