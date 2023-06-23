# NightwatchJS Teams Reporter

_This tool is a work in progress._

By default a card will only be sent to teams if there is an error, this behaviour can be overridden with options described below.

## Installation:

`npm i nightwatchjs_teams_reporter --save`

You will also either need to set the URL of your Teams webhook as an environment variable in your tool of choice, a .env file locally, in your terminal or using the options below (recommended for testing only).

Environment variable: `INBOUND_TEAMS_WEBHOOK=<Replace <this> with your Teams WebhookURL e.g. https://place.webhook.office.com/webhook/abigoldhash>`

## Usage

Include in npm scripts as below:

```
	"scripts": {
		"test": "nightwatch",
		"test:reporter": "nightwatch --reporter=nightwatch_teams_reporter",
		"test:reporter:projectName": "npm run test:reporter --testProjectName='Non-default Test ProjectName'",
		"test:reporter:send": "npm run test:reporter --sendOnSuccess"
	},
```

This example us from Windows. I found concatinating together different options tricky and the internet seems to think this is a Windows consideration. So above you can see I reuse `test:reporter` in other scripts rather than chaining together options.

### Options:

- `--sendOnSuccess` override default behaviour and send a card to Teams regardless of whether there has been a failure or not.
- `--testProjectName` give your test project a name. Usage: `--testProjectName='The Name of my Project'.
- `--testWebhookURL` define your teams webhook URL, this is here for testing, I recommend you use an environment variable in your build pipeline to keep this URL obscured.

## Thanks

- [Nightwatch Slack Reporter](https://github.com/nightwatchjs-community/nightwatch-slack-reporter) inspired me to put this together.
