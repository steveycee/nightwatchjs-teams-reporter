// We need to import our function
const { write } = require("./index.js"); // replace with the path to your file
const fetchMock = require("jest-fetch-mock");

// Enable fetch mocks
fetchMock.enableMocks();

beforeEach(() => {
  // reset the fetch mock before each test
  fetchMock.resetMocks();

  // set the environment variables for the test
  process.env = {
    npm_config_testWebhookURL: "http://example.com/webhook",
    INBOUND_TEAMS_WEBHOOK: "http://fallback.com/webhook",
  };
});

test("sendCardToTeams should make a POST request if there are errors", async () => {
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
    body: expect.any(String),
  });
});

test("sendCardToTeams should log a message if there are no errors", async () => {
  const results = {
    lastError: null,
    error: 0,
  };

  console.log = jest.fn();

  await write(results);

  expect(console.log).toHaveBeenCalledWith(expect.any(String));
});
