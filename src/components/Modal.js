import React from "react";
import ReactDOM from "react-dom";

export default function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <>
      <div
        className="modal-backdrop show"
        onClick={onClose}
      ></div>

      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">My Cart</h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              {children}
            </div>

          </div>
          
        </div>
      </div>
    </>,
    document.getElementById("cart-root")
  );
}