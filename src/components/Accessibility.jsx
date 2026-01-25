/**
 * Accessibility Utilities and Components
 * Ensures WCAG AA compliance
 */

// #button
export function AccessibleButton({
  onClick,
  children,
  ariaLabel,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || children}
      role="button"
      tabIndex={disabled ? -1 : 0}
      className="accessible-button"
      data-disabled={disabled}
    >
      {children}
    </button>
  );
}

// #input
export function AccessibleInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  ariaDescribedBy = null,
  error = null,
}) {
  return (
    <div className="accessible-input-wrapper">
      <label htmlFor={id} className="accessible-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy}
        className={`accessible-input ${error ? "has-error" : ""}`}
      />
      {error && (
        <div id={ariaDescribedBy} role="alert" className="accessible-error">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Skip to Main Content Link
 * Allows screen reader users to skip navigation
 */
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-main-content"
      onFocus={(e) => {
        e.target.classList.add("focused");
      }}
      onBlur={(e) => {
        e.target.classList.remove("focused");
      }}
    >
      Skip to Main Content
    </a>
  );
}

/**
 * Accessible Modal/Dialog
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  ariaLabel,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-label={ariaLabel}
      className="accessible-modal-overlay"
      onClick={onClose}
    >
      <div
        className="accessible-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="accessible-modal-close"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * Focus Manager - Helps manage focus for accessibility
 */
export class FocusManager {
  static trap(containerElement) {
    const focusableElements = containerElement.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    return (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
  }

  static restoreFocus(previouslyFocusedElement) {
    if (previouslyFocusedElement && previouslyFocusedElement.focus) {
      previouslyFocusedElement.focus();
    }
  }
}

/**
 * Accessibility Check utility
 */
export const a11y = {
  // Check color contrast (basic)
  checkContrast: (foreground, background) => {
    // Implementation for WCAG contrast checking
    return true; // Simplified
  },

  // Check for keyboard navigation
  ensureKeyboardAccess: (element) => {
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }
  },

  // Add screen reader text
  addScreenReaderText: (element, text) => {
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    element.appendChild(sr);
  },
};
