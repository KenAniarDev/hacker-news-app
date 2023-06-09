import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HomePage from "./HomePage";
import { createServer } from "../server";
const renderComponent = () => {
  const { container } = render(
    <Router>
      <HomePage handleNewsClick={() => {}} />
    </Router>
  );

  return { container };
};
describe("HomePage", () => {
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
    renderComponent();
    const homeText = await screen.findByText("Home");
    expect(homeText).toBeInTheDocument();
  });

  test("should render news on mount", async () => {
    renderComponent();
    const news = await screen.findByRole("link");
    expect(news).toBeInTheDocument();
  });

  test("fetches news every 10 seconds", async () => {
    renderComponent();

    const news = await screen.findAllByRole("link");

    await new Promise((r) => setTimeout(r, 11000));
    const news2 = await screen.findAllByRole("link");

    expect(news2.length).toBeGreaterThan(news.length);
  });

  test("tests the scroll event, fetch if near the end", async () => {
    const { container } = renderComponent();
    const news1 = await screen.findAllByRole("listitem");

    // fireEvent.scroll(window, {
    //   target: { scrollY: container.offsetHeight * 0.7 },
    // });
    fireEvent.scroll(window, { target: { scrollY: window.innerHeight * 0.7 } });

    await new Promise((resolve) => setTimeout(resolve, 100));
    const news2 = await screen.findAllByRole("listitem");
    console.log(news2.length);
    expect(news2.length).toBeGreaterThan(news1.length);
  });

  test("tests the scroll event, dont fetch if not near the end", async () => {
    renderComponent();
    const news1 = await screen.findAllByRole("link");
    fireEvent.scroll(window, { target: { scrollY: window.innerHeight * 0.2 } });
    console.log(window.innerHeight);
    console.log(document.documentElement.offsetHeight);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const news2 = await screen.findAllByRole("link");
    console.log(news2.length);
  });

  test("handleSearch is called with input value on input change", async () => {
    renderComponent();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test search term" } });
    const searchText = screen.getByText(/test search term/i);
    expect(searchText).toBeInTheDocument();
  });

  test("render filtered news based on the search string", async () => {
    renderComponent();
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

describe("HomePage Fail Api Request", () => {
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
        throw new Error("error");
        return {
          hits: [
            {
              created_at: "2023-06-06T15:50:21.000Z",
              title: "title " + page,
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

  test("error should be displayed if fetch fails", async () => {
    renderComponent();
    // Wait for the error element to be present in the document
    const errorElement = await screen.findByTitle("error");
    // Now you can make assertions about the errorElement, for example:
    expect(errorElement).toBeInTheDocument();
  });
});
