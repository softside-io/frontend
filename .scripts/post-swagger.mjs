import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontEndApiPath = path.join(__dirname, '..', 'projects', 'api');
const modelsPath = path.join(frontEndApiPath, 'models');

startPostProcessing();

function startPostProcessing() {
	findAndProcessFiles(modelsPath, processEnumFile);
	console.log('Completed processing all directories.');
}

function findAndProcessFiles(startPath, ...functions) {
	let entries;
	try {
		entries = fs.readdirSync(startPath, { withFileTypes: true });
	} catch (err) {
		console.error(`Error reading the directory ${startPath}:`, err);
		return;
	}

	for (let entry of entries) {
		const entryPath = path.join(startPath, entry.name);
		if (entry.isFile()) {
			for (const func of functions) {
				func(entryPath);
			}
		}
	}
}

function processEnumFile(filePath) {
	if (!filePath.endsWith('Enum.ts')) return;

	try {
		const fileContent = fs.readFileSync(filePath, 'utf8');

		const updatedContent = fileContent.replace(
			/export enum (\w+) {\s*((?:.|\s)*?)}/gm,
			(match, enumName, enumBody) => {
				const transformedBody = enumBody
					.trim()
					.split(/\n/)
					.map((line) => {
						// Extract key and value, assuming format is KEY = 'Value'
						const [key, value] = line
							.split('=')
							.map((s) => s.trim().replaceAll(',', '').replaceAll("'", ''));

						// Transform key by removing digits and value to extract digits or keep as-is
						const newKey = key.replace(/\d+$/, '');

						const newValue = value.match(/\d+$/)
							? parseInt(value.match(/\d+$/)[0])
							: `'${value}'`;

						return `    ${newKey} = ${newValue},`;
					})
					.join('\n');

				return `export enum ${enumName} {\n${transformedBody}\n}`;
			},
		);

		fs.writeFileSync(filePath, updatedContent, 'utf8');
		console.log(`${filePath} has been successfully transformed.`);
	} catch (err) {
		console.error(`Error processing the file ${filePath}:`, err);
	}
}
