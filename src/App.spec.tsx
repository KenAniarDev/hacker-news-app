import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import App from "./App";
import { createServer } from "./server";

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
            title: "title " + page,
            url: "https://hackernews/" + page,
            author: "page " + page + " author",
            _tags: ["story", "author_commoner", "story_36214688"],
            objectID: "page",
          },
        ],
      };
    },
  },
]);

describe("App", () => {
  test("should render the HomePage component by default", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders HomePage when on / route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders NewsPage when on /news route", () => {
    render(
      <MemoryRouter initialEntries={["/news"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("News Page")).toBeInTheDocument();
  });
  //
  test("handleNewsClick updates selectedNews state correctly", async () => {
    render(
      <Router>
        <App />
      </Router>
    );
    const newsLink = await screen.findByTitle(/title 0/i);
    fireEvent.click(newsLink);
    const title = await screen.findByText(/title 0/i);
    expect(title).toBeInTheDocument();
  });
});
