import React from "react";
import PropTypes from "prop-types";

import { getIntBetween } from "../helpers/general";

// Matches the fade-out animation in components/blockquote.js, so the old quote
// finishes fading before the new one appears.
const FADE_OUT_MS = 400;

// The quotes are loaded once, on the first click, as a static chunk that the
// browser caches. Every click after that is picked locally with no request.
let quotesPromise = null;
const loadQuotes = () => {
  if (!quotesPromise) {
    quotesPromise = import("../data/quotes.json")
      .then((mod) => (mod.default || mod).quotes)
      .catch((err) => {
        quotesPromise = null;
        throw err;
      });
  }
  return quotesPromise;
};

const pickDifferentQuote = (quotes, current) => {
  if (quotes.length < 2) return quotes[0];
  let next;
  do {
    next = quotes[getIntBetween(0, quotes.length - 1)];
  } while (current && next.text === current.text);
  return next;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const quoteContext = React.createContext({ quote: null });
const { Provider } = quoteContext;

export const QuoteProvider = ({ children, initialQuote = null, serverError = null }) => {
  const [quote, setQuote] = React.useState(initialQuote);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(serverError);

  const fetchNewQuote = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const [quotes] = await Promise.all([loadQuotes(), wait(FADE_OUT_MS)]);
      setQuote((current) => pickDifferentQuote(quotes, current));
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  };

  return <Provider value={{ quote, loading, error, fetchNewQuote }}>{children}</Provider>;
};

QuoteProvider.propTypes = {
  children: PropTypes.node.isRequired,
  serverError: PropTypes.any,
  initialQuote: PropTypes.shape({
    text: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }),
};
