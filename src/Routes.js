import ResultsPage from "./pages/ResultsPage";
import VotingApp from "./pages/VotingApp";

export const VerifiedAccess = [
  {
    route: "/vote",
    comp: VotingApp,
  },
  {
    route: "/review",
    comp: ResultsPage,
  },
];
