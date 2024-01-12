import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import Dashboard from "@/components/dashboard/dashboard";

describe("Dashboard component", () => {
  it("should renders correctly", () => {
    const tree = renderer.create(<Dashboard />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should contain this header", () => {
    render(<Dashboard />);
    const header = screen.getByRole("heading");
    expect(header).toHaveTextContent("Dashboard");
  });
});
