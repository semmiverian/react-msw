import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

function baseUrl(path) {
  return new URL(path, 'https://jsonplaceholder.typicode.com').toString();
}

let handlers = [
  rest.get(baseUrl('/todos'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Lorem Ipsum',
        },
        {
          id: 2,
          title: 'test',
        },
      ])
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close);

test('renders learn react link', async () => {
  render(<App />);

  await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

  const userList = screen.getByTestId('user-list');

  expect(userList.childElementCount).toBe(2);

  expect(screen.getByText(/lorem ipsum/i)).toBeInTheDocument();
  expect(screen.getByText(/test/i)).toBeInTheDocument();
});

test('renders error page', async () => {
  server.use(rest.get(baseUrl('/todos')), (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Internal Server error' }));
  });

  render(<App />);
  await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

  expect(screen.getByText(/errorr/i)).toBeInTheDocument();
});
