import React, { Component } from "react";
import { NewsType } from "../types";
import { Link } from "react-router-dom";
import Search from "../components/Search";

type NewsPageProps = {
  selectedNews: null | NewsType;
};

class NewsPage extends Component<NewsPageProps> {
  render() {
    return (
      <>
        <header className="py-5 flex items-center gap-5">
          <Link to={"/"}>
            <button
              className={
                "font-poppins text-5xl font-bold text-slate-700 font-semibold"
              }
            >
              &lt;
            </button>
          </Link>
          <h1 className="text-3xl font-bold underline text-slate-800">
            News Page
          </h1>
        </header>
        <div className={"py-5"}>
          {this.props.selectedNews ? (
            <pre className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 max-w-[992px] overflow-auto">
              <code className={"bg-gray-200 font-source-code-pro"}>
                {this.props.selectedNews &&
                  JSON.stringify(this.props.selectedNews, null, 3)}
              </code>
            </pre>
          ) : (
            <>No news selected</>
          )}
        </div>
      </>
    );
  }
}

export default NewsPage;
