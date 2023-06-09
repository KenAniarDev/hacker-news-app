import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HomePage from "./HomePage";
import { createServer } from "../server";
import { rest } from "msw";
import { setupServer } from "msw/node";

const renderComponent = async () => {
  const { container } = render(
    <Router>
      <HomePage handleNewsClick={() => {}} />
    </Router>
  );
  await screen.findAllByRole("link");
  return { container };
};
describe("Homepage tests", () => {
  jest.setTimeout(17000);

  createServer([
    {
      path: "https://hn.algolia.com/api/v1/search_by_date",
      method: "get",
      res: (req, res, ctx) => {
        const page = req.url.searchParams.get("page");
        if (!page) {
          return {
            hits: [],
          };
        }
        return {
          hits: [
            {
              created_at: "2023-06-06T15:50:21.000Z",
              title: "news-title " + page,
              url: "https://hackernews/" + page,
              author: "page " + page + " author",
              _tags: ["story", "author_commoner", "story_36214688"],
              objectID: "page" + page,
            },
          ],
        };
      },
    },
  ]);

  test("should render the HomePage component by default", async () => {
    await renderComponent();
    const homeText = await screen.findByText("Home");
    expect(homeText).toBeInTheDocument();
  });

  test("should render news on mount", async () => {
    await renderComponent();
    const news = await screen.findByRole("link");
    expect(news).toBeInTheDocument();
  });

  test("fetches news every 10 seconds", async () => {
    await renderComponent();

    const news = await screen.findAllByRole("link");
    await act(async () => {
      await new Promise((r) => setTimeout(r, 11000));
    });
    const news2 = await screen.findAllByRole("link");

    expect(news2.length).toBeGreaterThan(news.length);
  });

  test("tests the scroll event, fetch if near the end", async () => {
    const { container } = await renderComponent();
    const news1 = await screen.findAllByRole("listitem");

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.scroll(window, {
        target: {
          scrollY: (container.offsetTop + container.offsetHeight) * 0.7,
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    const news2 = await screen.findAllByRole("listitem");
    const homepageContainer = await screen.findByTestId("homepage-container");
    expect(homepageContainer).toBeInTheDocument();
    expect(news2.length).toBeGreaterThan(news1.length);
  });

  test("handleSearch is called with input value on input change", async () => {
    await renderComponent();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test search term" } });
    const searchText = screen.getByText(/test search term/i);
    expect(searchText).toBeInTheDocument();
  });

  test("render filtered news based on the search string", async () => {
    await renderComponent();
    const input = await screen.findByRole("textbox");
    let searchTerm = "abcdef";

    fireEvent.change(input, { target: { value: searchTerm } });
    await new Promise((resolve) => setTimeout(resolve, 100));
    let news = screen.queryAllByRole("listitem");
    expect(news.length).toEqual(0);

    searchTerm = "news-title 0";
    fireEvent.change(input, { target: { value: searchTerm } });
    news = screen.queryAllByRole("listitem");
    expect(news.length).toEqual(1);
  });
});

describe("HomePage test for failed API request", () => {
  // Define the server request handler
  const server = setupServer(
    rest.get(
      "https://hn.algolia.com/api/v1/search_by_date",
      (req, res, ctx) => {
        return res(
          ctx.status(500), // Set the response status to 500 for an error
          ctx.json({ error: "Internal Server Error" }) // Respond with an error message
        );
      }
    )
  );

  // Start the server before running your tests
  beforeAll(() => server.listen());

  // Reset the server after each test
  afterEach(() => server.resetHandlers());

  // Clean up the server after all tests
  afterAll(() => server.close());

  test("error should be displayed if fetch fails", async () => {
    await renderComponent();
    const errorElement = await screen.findByTitle("error");
    expect(errorElement).toBeInTheDocument();
  });
});
