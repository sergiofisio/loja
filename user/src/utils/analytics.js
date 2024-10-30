import ReactGA from "react-ga4";

const TRACKING_ID = "G-Q8LM71828M"; // Substitua pelo seu GA_MEASUREMENT_ID
ReactGA.initialize(TRACKING_ID);

export const trackPageView = (page, title = "") => {
  ReactGA.send({
    hitType: "pageview",
    page: page,
    title: title,
  });
};
