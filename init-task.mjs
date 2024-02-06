import { execSync } from 'child_process';
import { existsSync } from 'fs';

let dependencies;
let inquirer;

await initRepo();

async function initRepo() {
	if (modulesInstalled()) {
		console.log('\nStarting...\n');
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
	const answers = await prompt([
		{
			type: 'confirm',
			name: 'pull',
			message: 'Do you want to pull?',
		},
		{
			type: 'confirm',
			name: 'startApp',
			message: 'Start the application?',
		},
	]);

	if (answers.pull) {
		execSync('git pull', { stdio: 'inherit' });
	}

	dependencies = (await import('check-dependencies')).sync();
	if (dependencies.status) {
		const installDeps = await prompt([
			{
				type: 'confirm',
				name: 'nodeModules',
				message:
					'I found missing packages from your local node_modules. Do you want to install them now?',
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
	if (existsSync('./node_modules')) {
		if (
			existsSync('./node_modules/check-dependencies') &&
			existsSync('./node_modules/inquirer')
		) {
			return true;
		}
	}

	return false;
}
