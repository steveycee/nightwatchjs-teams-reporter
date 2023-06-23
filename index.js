const chalk = require("chalk");

function postMessage(results) {
	const sendOnSuccess = process.env.npm_config_sendOnSuccess;
	const url =
		process.env.npm_config_testWebhookURL || process.env.INBOUND_TEAMS_WEBHOOK;

	if (results.lastError != null || sendOnSuccess == 1 || results.error > 0) {
		sendCard();
		console.log("SENDING CARD");
	} else {
		console.log("NOT SENDING CARD BECAUSE THERE WAS NO ERRROR ");
	}

	function sendCard() {
		const lastErrorObj = results.lastError;

		// Handling last error
		let lastErrorPre = lastErrorObj
			? results.lastError.toString()
			: "No errors \u{1F60E}";

		// Configuring Project Name
		const testProjectName =
			process.env.npm_config_testProjectName || "NightwatchJS Test Run";

		// Sending the message to teams
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
						activityTitle:
							testProjectName +
							" with: " +
							results.assertions +
							" assertions to run.",
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
								value:
									"<pre style='white-space: pre-wrap;'>" +
									lastErrorPre +
									"</pre>",
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
NightwatchJS Teams Reporter invoked and returned: `) +
						chalk.white(data) +
						chalk.blue(`.
   			`)
				);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
}

module.exports = {
	write: async function (results, options) {
		postMessage(results);
	},
};
