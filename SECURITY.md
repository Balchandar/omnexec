# Security Policy

## Supported Versions

This project is under active development. Only the latest version on the `main` branch is currently supported with security updates.

| Version | Supported |
| ------- | --------- |
| latest  | yes       |
| older   | no        |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

### How to report

* Use GitHub Security Advisories (preferred):

  * Go to the repository
  * Click "Security"
  * Click "Report a vulnerability"

If GitHub Security Advisories are not available, you may open an issue and clearly mark it as a security concern. Avoid including sensitive exploit details in public issues.

---

## What to include

Please provide as much detail as possible:

* Description of the vulnerability
* Steps to reproduce
* Impact assessment
* A minimal `.ai` file or input that triggers the issue (if applicable)

---

## Response process

* Acknowledgement within 48 hours
* Initial assessment within 3–5 days
* Fix timeline depends on severity and complexity

---

## Disclosure policy

* Do not publicly disclose the issue until a fix has been released
* Once resolved, the vulnerability may be disclosed with proper credit

---

## Scope

This policy applies to:

* CLI execution (`omnx run`, `omnx test`)
* `.ai` file parsing and execution
* Context resolution (file and stdin handling)
* Assertion system

---

## Out of scope

* Issues caused by third-party providers
* Misuse of the tool outside intended functionality
* Non-security-related bugs or feature requests

---

## Notes

OmnExec executes user-defined prompt files and may read local files or stdin. Users should review `.ai` files before execution, especially when sourced from untrusted locations.
