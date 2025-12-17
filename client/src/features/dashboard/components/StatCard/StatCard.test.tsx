import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "./StatCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

describe("StatCard Component", () => {
  const defaultProps = {
    title: "Total Students",
    value: "2,543",
    icon: <PeopleAltIcon data-testid="icon" />,
    color: "#3b82f6",
  };

  it("renders the title and value correctly", () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("2,543")).toBeInTheDocument();
  });

  it("renders the trend indicator when provided", () => {
    render(<StatCard {...defaultProps} trend="+12%" trendUp={true} />);

    expect(screen.getByText(/12%/)).toBeInTheDocument();
    expect(screen.getByText("↑ +12%")).toBeInTheDocument();
  });

  it("renders the trend indicator correctly for downward trend", () => {
    render(<StatCard {...defaultProps} trend="-5%" trendUp={false} />);

    expect(screen.getByText(/5%/)).toBeInTheDocument();
    expect(screen.getByText("↓ -5%")).toBeInTheDocument();
  });

  it("does not render trend section if not provided", () => {
    render(<StatCard {...defaultProps} />);

    const trendElement = screen.queryByText(/%/);
    expect(trendElement).not.toBeInTheDocument();
  });
});
