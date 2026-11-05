import React from "react";
import PropTypes from "prop-types";

import data from "../data/quotes.json";
import { getIntBetween } from "../helpers/general";
import { QuoteProvider } from "../contexts/quote";
import HomeView from "../components/home-view";

const HomePage = ({ quote = null }) => (
  <QuoteProvider initialQuote={quote}>
    <HomeView />
  </QuoteProvider>
);

// Picks the first quote at build/revalidate time straight from the data file,
// rather than calling our own API over the network.
export const getStaticProps = async () => {
  const quote = data.quotes[getIntBetween(0, data.quotes.length - 1)];
  return { props: { quote }, revalidate: 3600 };
};

HomePage.propTypes = {
  quote: PropTypes.shape({
    text: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }),
};

export default HomePage;
