import React, { Component } from "react";
import { NewsType } from "../types";
import { Link } from "react-router-dom";

type NewsPropType = {
  news: NewsType;
  handleNewsClick: (news: NewsType) => void;
};

class News extends Component<NewsPropType> {
  render() {
    return (
      <Link
        to={"/news"}
        onClick={() => this.props.handleNewsClick(this.props.news)}
        className={"p-4 rounded-md cursor-pointer w-full"}
        title={this.props.news.title}
      >
        <h3 className={"text-2xl font-medium text-slate-700"}>
          {this.props.news.title}-{this.props.news.objectID}
        </h3>

        <div className={"text-sm mt-2"}>Author: {this.props.news.author}</div>
        <div className={"text-sm mt-1"}>
          Posted: {new Date(this.props.news.created_at).toDateString()}
        </div>
        <div className={"text-sm mt-1"}>
          <span>Tags:</span>{" "}
          {this.props.news._tags.map((item, i) => (
            <span key={item}>
              {i != 0 && ", "}
              {item}
            </span>
          ))}
        </div>

        <div className={"text-sm mt-1"}>Link: {this.props.news.url}</div>
      </Link>
    );
  }
}

export default News;
