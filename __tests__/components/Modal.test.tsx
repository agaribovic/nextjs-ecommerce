import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/Modal/Modal";
import React from "react";

describe("Modal component", () => {
  const mockClose = jest.fn();
  const modalTitle: string = "Test Modal";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isModalOpen is false", () => {
    render(
      <Modal isModalOpen={false} closeModal={mockClose} title={modalTitle}>
        {" "}
        <p>Content</p>{" "}
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when isModalOpen is true", () => {
    render(
      <Modal isModalOpen={true} closeModal={mockClose} title={modalTitle}>
        {" "}
        <p>Content</p>{" "}
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(modalTitle)).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("calls closeModal when overlay is clicked", () => {
    render(
      <Modal isModalOpen={true} closeModal={mockClose} title={modalTitle}>
        {" "}
        <p>Content</p>{" "}
      </Modal>
    );

    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("calls closeModal when close button is clicked", () => {
    render(
      <Modal isModalOpen={true} closeModal={mockClose} title={modalTitle}>
        {" "}
        <p>Content</p>{" "}
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
