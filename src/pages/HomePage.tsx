import React, { Component } from "react";
import Search from "../components/Search";
import { NewsType } from "../types";
import News from "../components/News";

type HomePageProps = {
  handleNewsClick: (news: NewsType) => void;
};

type HomePageState = {
  news: NewsType[];
  searchTerm: string;
  error: string | null;
};

class HomePage extends Component<HomePageProps, HomePageState> {
  containerRef: React.RefObject<HTMLDivElement>;
  scrollFetchLoading: boolean;
  nextPageNumber: number;
  intervalId: NodeJS.Timeout | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      news: [],
      searchTerm: "",
      error: null,
    };
    this.scrollFetchLoading = false;
    this.nextPageNumber = 0;
    this.handleScroll = this.handleScroll.bind(this);
    this.fetchNews = this.fetchNews.bind(this);
    this.containerRef = React.createRef<HTMLDivElement>();
  }

  async componentDidMount() {
    await this.fetchNews();
    window.addEventListener("scroll", this.handleScroll);
    this.intervalId = setInterval(this.fetchNews, 10000);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  async fetchNews() {
    try {
      const url =
        "https://hn.algolia.com/api/v1/search_by_date?tags=story&page=" +
        this.nextPageNumber;
      this.nextPageNumber = this.nextPageNumber + 1;
      const response = await fetch(url);
      const result = await response.json();
      this.setState({ news: [...this.state.news, ...result.hits] });
    } catch (e: any) {
      this.setState({ error: e.message });
    }
  }

  handleScroll = async () => {
    if (
      this.containerRef &&
      this.containerRef.current &&
      window.innerHeight + window.scrollY >=
        (this.containerRef.current.offsetTop +
          this.containerRef.current.offsetHeight) *
          0.7 &&
      !this.scrollFetchLoading
    ) {
      this.scrollFetchLoading = true;
      await this.fetchNews();
      this.scrollFetchLoading = false;
    }
  };

  handleInputSearchChange = (searchTerm: string) => {
    this.setState({ searchTerm: searchTerm });
  };
  render() {
    const { handleNewsClick } = this.props;

    return (
      <div data-testid="homepage-container" ref={this.containerRef}>
        <header className="py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold underline text-slate-800">Home</h1>
          <Search handleSearch={this.handleInputSearchChange} />
        </header>
        {this.state.searchTerm.length > 0 && (
          <span>Showing search results for {this.state.searchTerm}</span>
        )}
        {this.state.error && <span title={"error"}>{this.state.error}</span>}
        {Array.isArray(this.state.news) && (
          <ul className="grid gap-6">
            {this.state.news
              .filter(
                (news) =>
                  news.title
                    .toLowerCase()
                    .includes(this.state.searchTerm.toLowerCase()) ||
                  news.author
                    .toLowerCase()
                    .includes(this.state.searchTerm.toLowerCase())
              )
              .map((newsItem: NewsType) => (
                <li
                  key={newsItem.objectID}
                  className="shadow-md p-4 rounded-md border border-slate-100"
                >
                  <News handleNewsClick={handleNewsClick} news={newsItem} />
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }
}

export default HomePage;
