# NightwatchJS Teams Reporter

_This tool is a work in progress._

By default a card will only be sent to teams if there is an error, this behaviour can be overridden with options described below.

## Installation and Setup:

`npm i nightwatchjs-teams-reporter --save`

Next you need to setup the URL for your webhook. You can look up how to get the [incoming webhook for teams here](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=dotnet).

You will also either need to set the URL that you got above so that NightwatchJS Teams Reporter can use it. In CI you can set it as an environment variable in your tool of choice. Locally you can use a .env file or set the environment variable locally in your terminal. You can also set it as an option when calling the NightwatchJS Teams Reporter using the options defined further down the readme (recommended for testing only).

I like using a .env file.

### .env

Create a .env file in the root of your project and populate it with something that looks like this.

Note you need to replace everything after the equals sign (=) with your inbound teams webhook URL.

`INBOUND_TEAMS_WEBHOOK=<Replace this with your Teams WebhookURL e.g. https://place.webhook.office.com/webhook/abigoldhash>`

## Usage

Here are some examples of usage below as they would appear in your projects `package.json` file under `scripts`:

```
"scripts": {
	"test": "nightwatch",
	"test:reporter": "nightwatch --reporter=nightwatchjs-teams-reporter",
	"test:reporter:projectName": "npm run test:reporter --testProjectName='Non-default Test ProjectName'",
	"test:reporter:send": "npm run test:reporter --sendOnSuccess"
},
```

_This is an example from Windows. I found concatinating together different options tricky and the internet seems to think this is a Windows consideration. So above you can see I reuse `test:reporter` in other scripts rather than chaining together options._

### Options:

- `--sendOnSuccess` override default behaviour and send a card to Teams regardless of whether there has been a failure or not.
- `--testProjectName` give your test project a name. Usage: `--testProjectName='The Name of my Project'.
- `--testWebhookURL` define your teams webhook URL, this is here for testing, I recommend you use an environment variable in your build pipeline to keep this URL obscured.

## Thanks

- [Nightwatch Slack Reporter](https://github.com/nightwatchjs-community/nightwatch-slack-reporter) inspired me to put this together.
