const chalk = require("chalk");

function postMessage(results) {
	const url = process.env.npm_config_testWebhookURL || process.env.INBOUND_TEAMS_WEBHOOK;


	let lastErrorPre = results.lastError.message
		? results.lastError
		: "No errors \u{1F60E}";
	let lastError = lastErrorPre.toString();

	const result = getTestResult(results.errors);

	function getTestResult() {
		if (results.lastError.message === null) {
			return "Looks good \u{1F603}";
		} else {
			return "Please review logs \u{1F628}";
		}
	}

	const testProjectName = process.env.npm_config_testProjectName || "NightwatchJS Test Run";

	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			"@type": "MessageCard",
			"@context": "http://schema.org/extensions",
			themeColor: "0072C6",
			summary: "Node Module Test",
			sections: [
				{
					activityTitle: testProjectName + " with: " + results.assertions + " assertions to run.",
					activitySubtitle: "Result: " + result,
					activityImage:
						"https://raw.githubusercontent.com/nightwatchjs/nightwatch/main/.github/assets/nightwatch-logo.png",
					facts: [
						{
							name: "Assertions Passed",
							value: results.passed,
						},
						{
							name: "Failed",
							value: results.failed,
						},
						{
							name: "Skipped",
							value: results.skipped,
						},
						{
							name: "Last Error",
							value: "<pre style='white-space: pre-wrap;'>" + lastError + "</pre>",
							isSubtle: false,
							wrap: true,
						},
					],
					markdown: false,
				},
			],
		}),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			console.log(
			chalk.blue(`
   	NightwatchJS Teams Reporter invoked and returned: `) + chalk.white(data) + chalk.blue(`.
   			`)
			);
			console.log(chalk.yellow.bold('[==] Break [=====================]'))
			// console.log(url)
			console.log(chalk.yellow.bold('[==] Break [=====================]'))

		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

module.exports = {
	write: async function (results, options) {
		postMessage(results)
	},
};