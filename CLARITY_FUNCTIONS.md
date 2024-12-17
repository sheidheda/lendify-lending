# Lendify Clarity Functions

This document provides an overview of the main Clarity functions used in the Lendify smart contracts.

# Clarity functions

(use-trait ft-trait .sip-010-trait.sip-010-trait)

(define-map collaterals
  { loan-id: uint }  ;; The key is the loan ID
  { amount: uint, token: principal }  ;; The collateral amount and token address
)

(define-public (deposit-collateral (loan-id uint) (amount uint) (token <ft-trait>))
  (let
    (
      (loan (unwrap! (contract-call? .loan-core get-loan loan-id) (err u404)))
    ) 
    ;; Make sure the borrower is the tx-sender
    (asserts! (is-eq (get borrower loan) tx-sender) (err u403))
    ;; Transfer the collateral amount from the borrower to the contract
    (try! (contract-call? token transfer amount tx-sender (as-contract tx-sender)))
    ;; Store the collateral details in the map
    (map-set collaterals
      { loan-id: loan-id }
      { amount: amount, token: (contract-of token) }
    )
    (ok true)
  )
)

(define-public (withdraw-collateral (loan-id uint) (token <ft-trait>))
  (let
    (
      (loan (unwrap! (contract-call? .loan-core get-loan loan-id) (err u404)))
      (collateral (unwrap! (map-get? collaterals { loan-id: loan-id }) (err u404)))
    )
    ;; Ensure the borrower is the one withdrawing and the loan is inactive
    (asserts! (is-eq (get borrower loan) tx-sender) (err u403))
    (asserts! (not (get is-active loan)) (err u403))
    ;; Transfer the collateral back to the borrower
    (try! (as-contract (contract-call? token transfer (get amount collateral) (as-contract tx-sender) tx-sender)))
    ;; Remove the collateral record from the map
    (map-delete collaterals { loan-id: loan-id })
    (ok true)
  )
)

;; Read-only function to get collateral information for a loan
(define-read-only (get-collateral (loan-id uint))
  (map-get? collaterals { loan-id: loan-id })
)


(use-trait ft-trait .sip-010-trait.sip-010-trait)

(define-data-var proposal-count uint u0)

(define-map proposals
  { id: uint }
  { 
    proposer: principal,
    description: (string-utf8 256),
    votes-for: uint,
    votes-against: uint,
    end-block: uint,
    executed: bool
  }
)

(define-map votes
  { proposal-id: uint, voter: principal }
  { amount: uint }
)

(define-public (create-proposal (description (string-utf8 256)) (voting-period uint))
  (let
    ((proposal-id (var-get proposal-count)))
    (map-set proposals
      { id: proposal-id }
      {
        proposer: tx-sender,
        description: description,
        votes-for: u0,
        votes-against: u0,
        end-block: (+ block-height voting-period),
        executed: false
      }
    )
    (var-set proposal-count (+ proposal-id u1))
    (ok proposal-id)
  )
)

(define-public (vote (proposal-id uint) (amount uint) (vote-for bool) (token <ft-trait>))
  (let
    ((proposal (unwrap! (map-get? proposals { id: proposal-id }) (err u404))))
    (asserts! (< block-height (get end-block proposal)) (err u403))
    (try! (contract-call? token transfer amount tx-sender (as-contract tx-sender)))
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      { amount: amount }
    )
    (if vote-for
      (map-set proposals { id: proposal-id }
        (merge proposal { votes-for: (+ (get votes-for proposal) amount) }))
      (map-set proposals { id: proposal-id }
        (merge proposal { votes-against: (+ (get votes-against proposal) amount) }))
    )
    (ok true)
  )
)

(define-public (execute-proposal (proposal-id uint))
  (let
    ((proposal (unwrap! (map-get? proposals { id: proposal-id }) (err u404))))
    (asserts! (>= block-height (get end-block proposal)) (err u403))
    (asserts! (not (get executed proposal)) (err u403))
    (asserts! (> (get votes-for proposal) (get votes-against proposal)) (err u403))
    (map-set proposals { id: proposal-id }
      (merge proposal { executed: true })
    )
    (ok true)
  )
)

(define-read-only (calculate-interest (principal uint) (rate uint) (time uint))
  (let
    ((interest (/ (* (* principal rate) time) u10000)))
    (ok interest)
  )
)

(define-read-only (get-total-repayment (principal uint) (rate uint) (time uint))
  (let
    ((interest (unwrap-panic (calculate-interest principal rate time))))
    (ok (+ principal interest))
  )
)




;; Lendify Token (LFY)

(impl-trait .sip-010-trait.sip-010-trait)

(define-fungible-token lendify-token)

(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var contract-owner principal tx-sender)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u4))
    (asserts! (> (ft-get-balance lendify-token sender) amount) (err u5))
    (ft-transfer? lendify-token amount sender recipient)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) (err u403))
    (ft-mint? lendify-token amount recipient)
  )
)

(define-read-only (get-name)
  (ok "Lendify Token")
)

(define-read-only (get-symbol)
  (ok "LFY")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance lendify-token account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply lendify-token))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) (err u403))
    (var-set token-uri new-uri)
    (ok true)
  )
)

(define-public (set-contract-owner (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) (err u403))
    (var-set contract-owner new-owner)
    (ok true)
  )
)




;; Liquidation Contract

(use-trait ft-trait .sip-010-trait.sip-010-trait)

(define-public (liquidate-loan (loan-id uint) (token <ft-trait>))
  (let
    (
      ;; Get the loan details from the loan-core contract
      (loan (unwrap! (contract-call? .loan-core get-loan loan-id) (err u404)))
      ;; Get the collateral information from the collateral-manager contract
      (collateral (unwrap! (contract-call? .collateral-manager get-collateral loan-id) (err u404)))
    )

    ;; Assert that the loan's due date has passed
    (asserts! (> block-height (get due-date loan)) (err u403))

    ;; Assert that the loan is still active
    (asserts! (get is-active loan) (err u403))

    ;; Transfer the collateral from the contract to the lender
    (try! (as-contract (contract-call? token transfer (get amount collateral) (as-contract tx-sender) (get lender loan))))

    ;; Close the loan in the loan-core contract
    (try! (contract-call? .loan-core close-loan loan-id))

    ;; Return success
    (ok true)
  )
)



(use-trait ft-trait .sip-010-trait.sip-010-trait)

(define-map loans
  { id: uint }
  {
    borrower: principal,
    lender: principal,
    amount: uint,
    collateral: uint,
    interest-rate: uint,
    due-date: uint,
    is-active: bool
  }
)

(define-data-var next-loan-id uint u0)

(define-public (create-loan 
    (lender principal)
    (amount uint)
    (collateral uint)
    (interest-rate uint)
    (duration uint)
    (token <ft-trait>))
  (let
    ((loan-id (var-get next-loan-id))
     (due-date (+ block-height duration)))
    (try! (contract-call? token transfer amount tx-sender (as-contract tx-sender)))
    (try! (contract-call? token transfer collateral tx-sender (as-contract tx-sender)))
    (map-set loans
      { id: loan-id }
      {
        borrower: tx-sender,
        lender: lender,
        amount: amount,
        collateral: collateral,
        interest-rate: interest-rate,
        due-date: due-date,
        is-active: true
      }
    )
    (var-set next-loan-id (+ loan-id u1))
    (ok loan-id)
  )
)

(define-read-only (get-loan (loan-id uint))
  (map-get? loans { id: loan-id })
)

(define-public (close-loan (loan-id uint))
  (let ((loan (unwrap! (get-loan loan-id) (err u404))))
    (asserts! (is-eq tx-sender (get lender loan)) (err u403))
    (asserts! (get is-active loan) (err u403))
    (map-set loans
      { id: loan-id }
      (merge loan { is-active: false })
    )
    (ok true)
  )
)


;; sip-010 trait
(define-trait sip-010-trait
  (
    ;; Transfer tokens from one principal to another
    (transfer (uint principal principal) (response bool uint))

    ;; Get the name of the token
    (get-name () (response (string-ascii 32) uint))

    ;; Get the symbol of the token
    (get-symbol () (response (string-ascii 32) uint))

    ;; Get the number of decimals for the token
    (get-decimals () (response uint uint))

    ;; Get the balance of a principal
    (get-balance (principal) (response uint uint))

    ;; Get the total supply of the token
    (get-total-supply () (response uint uint))

    ;; Get the token URI (optional)
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)
