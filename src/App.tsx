import React from "react";
import "./App.css";
import { NewsType } from "./types";
import { Routes, Route } from "react-router-dom";
import NewsPage from "./pages/NewsPage";
import HomePage from "./pages/HomePage";

type AppPageState = {
  selectedNews: NewsType | null;
};

class App extends React.Component {
  state: AppPageState;
  constructor(props: any) {
    super(props);
    this.state = {
      selectedNews: null,
    };
  }

  handleNewsClick = (news: NewsType) => {
    this.setState({ selectedNews: news });
  };

  render() {
    return (
      <>
        <main className={"max-w-[992px] px-5 mx-auto"}>
          <Routes>
            <Route
              path="/"
              element={<HomePage handleNewsClick={this.handleNewsClick} />}
            />
            <Route
              path="/news"
              element={<NewsPage selectedNews={this.state.selectedNews} />}
            />
          </Routes>
        </main>
      </>
    );
  }
}

export default App;
