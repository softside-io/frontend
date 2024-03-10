/** @type {import('tailwindcss').Config} */

console.log('\n\x1b[35m ----------------------------------------\x1b[0m');
console.log('\x1b[35m  Building Tailwind for library!\x1b[0m');
console.log('\x1b[35m ----------------------------------------\n\x1b[0m');

module.exports = {
	content: [__dirname + '/lib/**/*.component.{html,ts}'],
	theme: {
		extend: {},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
};
