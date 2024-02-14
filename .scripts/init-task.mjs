import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let dependencies;
let inquirer;

await initRepo();

async function initRepo() {
	if (modulesInstalled()) {
		showBanner('softside.txt');
		inquirer = await import('inquirer');
		await startPrompt();
	} else {
		console.log('\nFailed to find dependencies. Installing dependencies...\n');
		if (installDependencies()) {
			await initRepo();
		} else {
			console.error(
				'\nFor this tool to work, you have to install the following: \n\nhttps://www.npmjs.com/package/check-dependencies\nhttps://www.npmjs.com/package/inquirer\n',
			);
			exitScript();
		}
	}
}

async function startPrompt() {
	const prompt = inquirer.createPromptModule();
	const questions = [
		{
			type: 'confirm',
			name: 'startApp',
			message: 'Start the application?',
		},
	];

	execSync('git remote update', { stdio: 'ignore' });
	const checkBranchUpdate = execSync('git status -uno', { encoding: 'utf-8' });
	if (!checkBranchUpdate.includes('Your branch is up to date with')) {
		questions.unshift({
			type: 'confirm',
			name: 'pull',
			message: 'Your branch is behind. Pull changes?',
		});
	}

	const answers = await prompt(questions);

	if (answers.pull) {
		execSync('git pull', { stdio: 'inherit' });
	}

	dependencies = (await import('check-dependencies')).sync();
	if (dependencies.status) {
		const installDeps = await prompt([
			{
				type: 'confirm',
				name: 'nodeModules',
				message: 'Found new dependencies that require installation. Install them now?',
			},
		]);

		if (installDeps.nodeModules) {
			installDependencies();
		}
	}

	if (!answers.startApp) {
		exitScript();
	}
}

function exitScript() {
	console.error('\nPress any key to exit\n');
	process.exit(1);
}

function installDependencies() {
	execSync('npm ci', { stdio: 'inherit' });
	return modulesInstalled();
}

function modulesInstalled() {
	if (fs.existsSync('./node_modules')) {
		if (
			fs.existsSync('./node_modules/check-dependencies') &&
			fs.existsSync('./node_modules/inquirer') &&
			fs.existsSync('./node_modules/chalk')
		) {
			return true;
		}
	}

	return false;
}

function showBanner(filePath) {
	try {
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const data = fs.readFileSync(path.join(__dirname, filePath), 'utf8');
		const coloredData = colorizeSpecificParts(data);

		console.log(coloredData);
	} catch (error) {
		console.error('Error reading the file:', error.message);
	}
}

function colorizeSpecificParts(text) {
	text = text.replace(/Starting.../g, chalk.hex('#621964')('Starting...'));
	text = text.replace(/█/g, chalk.hex('#621964')('█'));
	text = text.replace(/═/g, chalk.hex('#b18cb2')('═'));
	text = text.replace(/╝/g, chalk.hex('#b18cb2')('╝'));
	text = text.replace(/╗/g, chalk.hex('#b18cb2')('╗'));
	text = text.replace(/╚/g, chalk.hex('#b18cb2')('╚'));
	text = text.replace(/╔/g, chalk.hex('#b18cb2')('╔'));
	text = text.replace(/║/g, chalk.hex('#b18cb2')('║'));

	return text;
}
