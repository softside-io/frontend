import { createPromptModule } from 'inquirer';
import {
	exec,
	execSync,
} from 'child_process';

const scopes = [
	'core',
	'package',
	'auth',
	'profile',
	'shared',
	'library',
];

const types = [
	'build',
	'chore',
	'ci',
	'docs',
	'feat',
	'fix',
	'perf',
	'refactor',
	'revert',
	'style',
	'test',
];

const libraryScopes = [
	'element',
	'component',
	'shared',
	'utils',
];

const prompt =
	createPromptModule();

exec(
	'git branch --show-current',
	(err, stdout, stderr) => {
		const branchSplitted =
			stdout.split('-');
		const jiraTicketId = [
			branchSplitted[0],
			branchSplitted[1],
		].join('-');
		startPrompt(
			jiraTicketId,
		);
	},
);

function startPrompt(
	jiraTicketId,
) {
	prompt([
		{
			type: 'list',
			name: 'type',
			message:
				'Change Type:',
			choices: types,
		},
		{
			type: 'list',
			name: 'scope',
			message:
				'Scope of changes:',
			choices: scopes,
		},
		{
			type: 'list',
			name: 'specificScope',
			message:
				'Choose a specific scope',
			choices:
				libraryScopes,
			when: (answers) =>
				answers.scope ==
				'library',
		},
		{
			type: 'input',
			name: 'message',
			message:
				'Commit message',
			transformer: (
				input,
			) => {
				const messageLength =
					input.trim()
						.length;
				return `(${messageLength}): ${input}`;
			},
			validate: (
				input,
			) => {
				if (
					input ==
						'' ||
					input.length >
						50 ||
					input.length <
						10
				) {
					return 'Please enter a valid commit message.\n - Message not allowed to be empty \n - Maximum characters allowed is 50 characters \n - Minimum characters allowed is 10 characters';
				} else {
					return true;
				}
			},
			filter: (input) =>
				input
					.charAt(0)
					.toLowerCase() +
				input.slice(
					1,
				),
		},
		{
			type: 'input',
			name: 'jiraNumber',
			message:
				'JIRA Ticket Number: (SSA-{number})',
			default:
				jiraTicketId,
			validate: (
				input,
			) => {
				if (
					!!input &&
					input.match(
						/.+-\d+$/,
					)
				) {
					return true;
				} else {
					return 'Please enter a valid Jira number';
				}
			},
		},
		{
			type: 'input',
			name: 'description',
			message:
				'Detailed description:',
		},
		{
			type: 'confirm',
			name: 'breakingChange',
			default: false,
			message:
				'Is it a breaking change?',
		},
		{
			type: 'confirm',
			name: 'addFiles',
			message:
				'Add all files automatically?',
		},
	]).then((answers) => {
		if (
			answers.breakingChange
		) {
			console.log(
				'Breaking Change Not Implemented',
			);
		}

		const scope =
			answers.specificScope
				? answers.specificScope
				: answers.scope;
		const description =
			answers.description ||
			'';

		const commitCommand = `git commit -m "${answers.type}(${scope}): ${answers.message}" -m "${description}" -m "${answers.jiraNumber}"`;

		if (
			answers.addFiles
		) {
			execSync(
				'git add .',
				{
					stdio: 'inherit',
				},
			);
		}

		try {
			execSync(
				commitCommand,
				{
					stdio: 'inherit',
				},
			);
		} catch (e) {
			console.error(
				e.message,
			);
			process.exit(1);
		}

		prompt([
			{
				type: 'confirm',
				message:
					'Push changes?',
				name: 'push',
			},
		]).then((answers) => {
			if (
				answers.push
			) {
				execSync(
					'git push',
					{
						stdio: 'inherit',
					},
				);
			}
		});
	});
}
