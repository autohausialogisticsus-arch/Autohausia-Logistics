export type AgreementField = { label: string; placeholder: string };

export type AgreementSection =
  | {
      number: string;
      id: string;
      title: string;
      structured: false;
      scope: string;
      guidance: string;
    }
  | {
      number: string;
      id: string;
      title: string;
      structured: true;
      scope: string;
      groups: { groupLabel?: string; fields: AgreementField[] }[];
      footnote?: string;
    };

export const AGREEMENT_SECTIONS: AgreementSection[] = [
  {
    number: "01",
    id: "introduction",
    title: "Introduction",
    structured: false,
    scope:
      "What this agreement covers. Autohausia Logistic LLC (the \"Dispatch Provider\") coordinates freight dispatch for the Carrier, and the Carrier pays dispatch fees as agreed.",
    guidance:
      "Provide the introduction for the finalized agreement: the entities involved, the purpose of the dispatch relationship, and that the parties intend to be legally bound by the finalized document.",
  },
  {
    number: "02",
    id: "effective-date",
    title: "Effective Date",
    structured: true,
    scope: "The date this agreement takes effect, completed on the finalized, executed document.",
    groups: [
      {
        fields: [
          { label: "Effective Date", placeholder: "____" },
          { label: "Reference / Carrier ID", placeholder: "____" },
        ],
      },
    ],
  },
  {
    number: "03",
    id: "parties",
    title: "Parties",
    structured: true,
    scope: "The two parties to this agreement and their identifying details.",
    groups: [
      {
        groupLabel: "Dispatch Provider",
        fields: [
          { label: "Legal entity", placeholder: "Autohausia Logistic LLC" },
          { label: "Address", placeholder: "____" },
          { label: "Contact", placeholder: "____" },
        ],
      },
      {
        groupLabel: "Carrier",
        fields: [
          { label: "Legal name", placeholder: "____" },
          { label: "Address", placeholder: "____" },
          { label: "MC / USDOT number", placeholder: "____" },
        ],
      },
    ],
  },
  {
    number: "04",
    id: "services",
    title: "Services",
    structured: false,
    scope:
      "The scope of dispatch services the Dispatch Provider performs for the Carrier — including freight sourcing, rate negotiation, and paperwork coordination — and any services that are excluded.",
    guidance:
      "Define the exact dispatch services covered and confirm what the Carrier does NOT receive (for example warehousing, driver payroll, or back-office accounting), based on how the business actually operates.",
  },
  {
    number: "05",
    id: "dispatch-authority",
    title: "Dispatch Authority",
    structured: false,
    scope:
      "The authority, if any, the Carrier grants the Dispatch Provider to act on its behalf with brokers and shippers, and any limits on that authority.",
    guidance:
      "State whether the Dispatch Provider may bind the Carrier, negotiate rates, or sign rate confirmations, and where the Carrier's written approval is required. Confirm the actual operating model with the business.",
  },
  {
    number: "06",
    id: "carrier-responsibilities",
    title: "Carrier Responsibilities",
    structured: false,
    scope:
      "Obligations the Carrier agrees to fulfill: equipment condition and maintenance, compliance, safe and timely performance of loads, and required paperwork.",
    guidance:
      "List Carrier duties that reflect real operations: on-time pickup and delivery, driver and equipment compliance, transporting freight in good condition, and completing delivery paperwork.",
  },
  {
    number: "07",
    id: "dispatch-responsibilities",
    title: "Dispatch Responsibilities",
    structured: false,
    scope:
      "Obligations the Dispatch Provider agrees to fulfill: load sourcing, rate coordination, and communication with brokers throughout the dispatch relationship.",
    guidance:
      "List Dispatch duties reflecting actual service levels: matching freight to the Carrier's equipment and lanes, negotiating when authorized, providing rate and load documentation, and keeping the Carrier informed.",
  },
  {
    number: "08",
    id: "load-approval",
    title: "Load Approval",
    structured: false,
    scope:
      "How loads are presented, whether any load may be declined, and that no load is booked without the Carrier's approval.",
    guidance:
      "Confirm the approval requirement is explicit: every load is presented in advance and booked only upon the Carrier's approval, matching what the site already promises.",
  },
  {
    number: "09",
    id: "broker-communications",
    title: "Broker Communications",
    structured: false,
    scope:
      "How the Dispatch Provider communicates with brokers on behalf of the Carrier and how the Carrier stays informed.",
    guidance:
      "Describe who may contact brokers, what information may be shared, and how the Carrier approves bookings initiated through broker communications.",
  },
  {
    number: "10",
    id: "fees",
    title: "Fees",
    structured: false,
    scope: "The dispatch fee structure and how fees are calculated or agreed for each load.",
    guidance:
      "Insert Autohausia's actual fee arrangement (for example a per-load percentage or flat fee) and how fees are agreed before a load is booked. Business policy — do not draft fee numbers without confirmation.",
  },
  {
    number: "11",
    id: "payment-terms",
    title: "Payment Terms",
    structured: false,
    scope: "How and when the Carrier pays dispatch fees to the Dispatch Provider.",
    guidance:
      "Insert actual payment terms: how fees are invoiced, when they are due, and how they are settled against loads. Business policy — do not draft payment terms without confirmation.",
  },
  {
    number: "12",
    id: "termination",
    title: "Termination",
    structured: false,
    scope: "How either party may end this agreement and any notice required.",
    guidance:
      "Insert the business's actual termination provisions and any notice period. Business policy — do not draft termination terms without confirmation.",
  },
  {
    number: "13",
    id: "confidentiality",
    title: "Confidentiality",
    structured: false,
    scope: "Handling of confidential information shared between the parties during the relationship.",
    guidance:
      "Provide confidentiality obligations covering carrier data, rates, lane information, and other business information exchanged during the relationship.",
  },
  {
    number: "14",
    id: "dispute-and-legal-provisions",
    title: "Dispute and Legal Provisions",
    structured: false,
    scope: "Governing law, jurisdiction, and how disputes between the parties are resolved.",
    guidance:
      "Insert governing law, jurisdiction and venue, and any dispute-resolution terms after review by qualified legal counsel.",
  },
  {
    number: "15",
    id: "signatures",
    title: "Signatures",
    structured: true,
    scope:
      "Execution of the finalized agreement by both parties. This template does not capture or store signatures.",
    footnote:
      "This page does not collect, store, or process signatures or legal acceptance. The finalized agreement must be executed and retained by both parties.",
    groups: [
      {
        groupLabel: "Dispatch Provider — Autohausia Logistic LLC",
        fields: [
          { label: "Signature", placeholder: "____" },
          { label: "Printed name / Title", placeholder: "____" },
          { label: "Date", placeholder: "____" },
        ],
      },
      {
        groupLabel: "Carrier",
        fields: [
          { label: "Signature", placeholder: "____" },
          { label: "Printed name / Title", placeholder: "____" },
          { label: "Date", placeholder: "____" },
        ],
      },
    ],
  },
];