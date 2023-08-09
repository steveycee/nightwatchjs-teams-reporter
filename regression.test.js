const { write } = require("./index.js");
const fetchMock = require("jest-fetch-mock");

fetchMock.enableMocks();

beforeEach(() => {
	fetchMock.resetMocks();

	process.env = {
		npm_config_testWebhookURL: "http://example.com/webhook",
		INBOUND_TEAMS_WEBHOOK: "http://fallback.com/webhook",
	};
});

test("sendCardToTeams should log a message if there are no errors", async () => {
	const results = {
		lastError: null,
		error: 0,
	};

	console.log = jest.fn();

	await write(results);

	expect(console.log).toHaveBeenCalledWith(
		expect.stringContaining(
			"NightwatchJS Teams Reporter has not sent a card to teams."
		)
	);
});

test("sendCardToTeams should not send if there are no errors", async () => {
	const results = {
		lastError: null,
		error: 0,
	};

	fetchMock.mockResponseOnce(JSON.stringify({ data: "12345" }));

	console.log = jest.fn();

	await write(results);

	expect(fetchMock.mock.calls.length).toEqual(0);
});

test("sendCardToTeams should send if there are no errors but the send on success flag is set", async () => {
	process.env.npm_config_sendOnSuccess = "true";

	const results = {
		lastError: null,
		error: 0,
	};

	fetchMock.mockResponseOnce(JSON.stringify({ data: "12345" }));

	console.log = jest.fn();

	await write(results);

	expect(fetchMock.mock.calls.length).toEqual(1);
});

test("sendCardToTeams should make a POST request if there are errors and match", async () => {
	const results = {
		lastError: "error",
		error: 1,
	};

	fetchMock.mockResponseOnce(JSON.stringify({ data: "12345" }));

	console.log = jest.fn();

	await write(results);

	expect(fetchMock.mock.calls.length).toEqual(1);
	expect(fetchMock.mock.calls[0][0]).toEqual(
		process.env.npm_config_testWebhookURL || process.env.INBOUND_TEAMS_WEBHOOK
	);
	expect(fetchMock.mock.calls[0][1]).toEqual({
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: expect.stringContaining(
			'{"@type":"MessageCard","@context":"http://schema.org/extensions","themeColor":"0072C6","summary":"Node Module Test","sections":[{"activityTitle":"NightwatchJS Test Run with: undefined assertions to run.","activityImage":"https://raw.githubusercontent.com/nightwatchjs/nightwatch/main/.github/assets/nightwatch-logo.png","facts":[{"name":"Assertions Passed"},{"name":"Failed"},{"name":"Skipped"},{"name":"Last Error","value":"<pre style=\'white-space: pre-wrap;\'>error</pre>","isSubtle":false,"wrap":true}],"markdown":false}]}'
		),
	});
});
