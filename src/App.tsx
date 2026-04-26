import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleX } from "lucide-react";

type CategorizationItem = {
  id: string;
  text: string;
  correctBucket: number;
};

type Question = {
  id: number;
  title: string;
  prompt: string;
  categorization: {
    buckets: string[];
    items: CategorizationItem[];
  };
  ordering: {
    prompt: string;
    steps: string[];
  };
};

type OrderingStep = {
  id: string;
  text: string;
  correctIndex: number;
};

type QuestionResponse = {
  categorization: Record<string, number | null>;
  ordering: OrderingStep[];
};

type Responses = Record<number, QuestionResponse>;

const competency = "CAHIIM Competency III.7. Identify standards for exchange of health information.";
const bloomLevel = "Bloom's Level 3 (Applying)";
const learningObjectives = [
  "Apply interoperability concepts, including foundational, structural, and semantic interoperability, to explain how health information is exchanged across healthcare systems. (Houser Ch.13)",
  "Apply healthcare data standards and terminologies (e.g., SNOMED CT, LOINC, ICD) to support accurate and consistent exchange of health information. (Houser Ch.13)",
  "Use healthcare messaging standards (e.g., HL7 and FHIR) to illustrate how data are transmitted between health information systems. (Houser Ch.13)",
  "Apply knowledge of national health information exchange infrastructure to explain the structure and role of networks such as the eHealth Exchange. (Houser Ch.13)",
];

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const assessmentBank: Question[] = [
  {
    id: 1,
    title: "Question 1",
    prompt:
      "A regional health system is reviewing how incoming laboratory information is handled across its applications. Sort each action into the best operational bucket for this scenario, then sequence the workflow a team would use to move a lab result from transmission to action-ready use.",
    categorization: {
      buckets: ["Structural interoperability focus", "Semantic interoperability focus"],
      items: [
        { id: "q1c1", text: "A hemoglobin result lands in the correct hematology field in the receiving record.", correctBucket: 0 },
        { id: "q1c2", text: "The receiving system interprets a value pattern as clinically significant and triggers follow-up attention.", correctBucket: 1 },
        { id: "q1c3", text: "LOINC-coded observations are placed into recognizable result fields across systems.", correctBucket: 0 },
        { id: "q1c4", text: "Standardized terminologies support shared clinical meaning across applications.", correctBucket: 1 },
        { id: "q1c5", text: "The receiving display preserves field-level organization from the sending system.", correctBucket: 0 },
      ],
    },
    ordering: {
      prompt:
        "A hospital wants a newly transmitted blood test result to become usable for care coordination. Arrange the actions in the most defensible operational sequence.",
      steps: [
        "Receive the transmitted laboratory message in the destination system.",
        "Place each result into the correct structured field in the record.",
        "Apply the shared terminology or coded meaning needed for interpretation.",
        "Surface the result in a clinically usable context for the care team.",
        "Trigger any downstream decision support or follow-up workflow that depends on interpreted meaning.",
      ],
    },
  },
  {
    id: 2,
    title: "Question 2",
    prompt:
      "A multi-vendor hospital is deciding whether a task depends primarily on a direct interface translation layer or on a more seamless integrated application approach. Categorize the examples, then order the best-response workflow for introducing a new application that must exchange data with existing systems.",
    categorization: {
      buckets: ["Interface-dependent situation", "Integrated application situation"],
      items: [
        { id: "q2c1", text: "A date must be rearranged from one national format to another before the receiving system can use it.", correctBucket: 0 },
        { id: "q2c2", text: "Products are designed to work together without extra user intervention.", correctBucket: 1 },
        { id: "q2c3", text: "A single date string must be split into month, day, and year fields for the receiving system.", correctBucket: 0 },
        { id: "q2c4", text: "Users move data among related applications with a consistent experience.", correctBucket: 1 },
        { id: "q2c5", text: "A separate rule set is needed for the reverse direction of data exchange.", correctBucket: 0 },
      ],
    },
    ordering: {
      prompt:
        "A new specialty application must exchange dates and identifiers with several existing systems. Sequence the team's implementation actions.",
      steps: [
        "Identify where the new application's data formats differ from current systems.",
        "Define translation rules for each required exchange pathway.",
        "Build or configure the interface or engine connections.",
        "Validate that receiving systems process the translated data correctly.",
        "Review connected interfaces after system updates or workflow changes.",
      ],
    },
  },
  {
    id: 3,
    title: "Question 3",
    prompt:
      "An HIM analyst is matching exchange methods to messaging needs across a hospital enterprise. Categorize each example according to the standard family that best fits the use case, then order the steps a team would follow to send a patient admission message using an HL7-based exchange workflow.",
    categorization: {
      buckets: ["HL7-focused exchange use", "X12-focused exchange use", "NCPDP-focused exchange use"],
      items: [
        { id: "q3c1", text: "Sharing patient administration and event-driven updates between clinical systems.", correctBucket: 0 },
        { id: "q3c2", text: "Submitting an institutional claim transaction for reimbursement.", correctBucket: 1 },
        { id: "q3c3", text: "Sending refill status communication between a prescriber and a pharmacy.", correctBucket: 2 },
        { id: "q3c4", text: "Managing order-related clinical messaging inside the care delivery environment.", correctBucket: 0 },
        { id: "q3c5", text: "Processing retail pharmacy payment-related transactions.", correctBucket: 2 },
      ],
    },
    ordering: {
      prompt:
        "A patient is admitted through the emergency department, and the hospital must push an admission event to another clinical system. Sequence the message preparation workflow.",
      steps: [
        "Identify the triggering clinical event that requires message transmission.",
        "Assemble the needed message header and segment content.",
        "Populate required administrative and patient data elements.",
        "Transmit the formatted message to the receiving system.",
        "Confirm that the receiving application accepts and processes the message instance.",
      ],
    },
  },
  {
    id: 4,
    title: "Question 4",
    prompt:
      "A care coordination team is selecting which terminology or coding approach best supports consistent meaning across systems. Categorize each application example, then order the workflow for normalizing mixed-source data so it can support reliable longitudinal use.",
    categorization: {
      buckets: ["Terminology or coding for shared meaning", "Normalization or mapping activity"],
      items: [
        { id: "q4c1", text: "Translating diagnosis and observation content into a consistent target vocabulary across datasets.", correctBucket: 1 },
        { id: "q4c2", text: "Using SNOMED CT so concepts carry precise meaning across systems.", correctBucket: 0 },
        { id: "q4c3", text: "Reconciling overlapping records from multiple providers to reduce redundancy.", correctBucket: 1 },
        { id: "q4c4", text: "Applying ICD-coded diagnoses in an exchange context where shared understanding matters.", correctBucket: 0 },
        { id: "q4c5", text: "Converting varied source coding approaches into a single analytic format.", correctBucket: 1 },
      ],
    },
    ordering: {
      prompt:
        "A patient's record aggregates diagnoses and lab results from several organizations. Arrange the workflow for preparing these data for dependable cross-system use.",
      steps: [
        "Collect the incoming data elements from each source system.",
        "Determine whether entries are truly distinct events or possible duplicates.",
        "Map source vocabularies or codes into the selected normalization target.",
        "Reconcile redundant or ambiguous entries using context and timing.",
        "Store the resulting normalized data for longitudinal use and downstream analysis.",
      ],
    },
  },
  {
    id: 5,
    title: "Question 5",
    prompt:
      "A hospital is modernizing document and API exchange capabilities. Categorize each use case by the dominant exchange approach, then order the implementation path for making patient data available through a FHIR-style API workflow.",
    categorization: {
      buckets: ["Document-centered exchange approach", "API/resource-centered exchange approach"],
      items: [
        { id: "q5c1", text: "Sending a care summary as a C-CDA document during a transition of care.", correctBucket: 0 },
        { id: "q5c2", text: "Retrieving an identified patient resource through a web-based request.", correctBucket: 1 },
        { id: "q5c3", text: "Attaching encoded document content through an HL7 message workflow.", correctBucket: 0 },
        { id: "q5c4", text: "Creating a new appointment through a standardized web call.", correctBucket: 1 },
        { id: "q5c5", text: "Using a continuity-oriented document template to share a clinical summary.", correctBucket: 0 },
      ],
    },
    ordering: {
      prompt:
        "An organization wants authorized external applications to retrieve patient data in a standardized way. Sequence the implementation logic.",
      steps: [
        "Identify the clinical data resource that should be made available.",
        "Define the standardized API endpoint or resource interaction.",
        "Configure the system to expose the requested resource securely.",
        "Execute the resource request from the approved application.",
        "Return the structured response for use in the destination workflow.",
      ],
    },
  },
  {
    id: 6,
    title: "Question 6",
    prompt:
      "An imaging department is deciding whether a scenario is primarily about imaging exchange or broader integration guidance. Categorize each task, then order the workflow for sharing an imaging study and associated report across enterprise systems.",
    categorization: {
      buckets: ["DICOM-centered need", "IHE-centered integration need"],
      items: [
        { id: "q6c1", text: "Moving radiology images from acquisition equipment to storage and viewing workstations.", correctBucket: 0 },
        { id: "q6c2", text: "Using an integration profile to coordinate standards for cross-system exchange.", correctBucket: 1 },
        { id: "q6c3", text: "Ensuring consistent transmission of MRI content across imaging platforms.", correctBucket: 0 },
        { id: "q6c4", text: "Standardizing a workflow that combines existing standards for a clinical use case.", correctBucket: 1 },
        { id: "q6c5", text: "Handling PACS-oriented image transfer and retrieval expectations.", correctBucket: 0 },
      ],
    },
    ordering: {
      prompt:
        "A clinician at another site needs timely access to both imaging content and its associated report. Arrange the exchange workflow.",
      steps: [
        "Acquire and store the imaging study in the originating system.",
        "Associate the report content with the imaging record for exchange.",
        "Apply the relevant integration pathway for cross-system sharing.",
        "Transmit or make available the study and report to the destination environment.",
        "Open the shared content in the receiving clinical workflow for review.",
      ],
    },
  },
  {
    id: 7,
    title: "Question 7",
    prompt:
      "An HIE organization is aligning common document-sharing and patient-matching functions to the right operational purpose. Categorize each example, then order the workflow for finding the right patient across organizations before retrieving exchange content.",
    categorization: {
      buckets: ["Document-sharing profile", "Patient identity or matching profile"],
      items: [
        { id: "q7c1", text: "Sending a clinical document with metadata on physical media or as an email attachment.", correctBucket: 0 },
        { id: "q7c2", text: "Requesting patient identifiers from a central patient information service using demographics.", correctBucket: 1 },
        { id: "q7c3", text: "Pushing a document directly between systems through a web-based point-to-point method.", correctBucket: 0 },
        { id: "q7c4", text: "Cross-referencing several local patient identifiers through a manager service.", correctBucket: 1 },
        { id: "q7c5", text: "Exchanging enterprise documents without relying on a central repository.", correctBucket: 0 },
      ],
    },
    ordering: {
      prompt:
        "A care team must confirm the correct patient across connected organizations before exchanging records. Sequence the operational process.",
      steps: [
        "Collect the patient demographics available at the point of care.",
        "Query the shared identity service using those demographics.",
        "Cross-reference any local identifiers returned across connected entities.",
        "Confirm that the matched patient identity supports the exchange request.",
        "Proceed with retrieving or pushing the needed record content.",
      ],
    },
  },
  {
    id: 8,
    title: "Question 8",
    prompt:
      "An HIO is aligning identifier practices with the purpose each identifier serves in exchange workflows. Categorize each example, then order the workflow for preparing an administrative exchange that depends on reliable provider identification.",
    categorization: {
      buckets: ["Provider or organization identifier use", "Patient identity management use"],
      items: [
        { id: "q8c1", text: "Using NPPES-linked identification in HIPAA administrative and financial transactions.", correctBucket: 0 },
        { id: "q8c2", text: "Maintaining an MPI so records from multiple systems can be linked to one person.", correctBucket: 1 },
        { id: "q8c3", text: "Referencing an EIN when exchanging employer-related insurance information.", correctBucket: 0 },
        { id: "q8c4", text: "Reducing fragmented records created by duplicate person entries across sites.", correctBucket: 1 },
        { id: "q8c5", text: "Applying a required national provider identifier in a regulated transaction.", correctBucket: 0 },
      ],
    },
    ordering: {
      prompt:
        "A health system is preparing a regulated exchange that requires dependable provider identification. Sequence the workflow.",
      steps: [
        "Determine which transaction or exchange scenario is being performed.",
        "Identify the required provider or organization identifier for that scenario.",
        "Validate that the identifier is current and linked to the correct entity.",
        "Include the identifier in the transaction payload or exchange record.",
        "Verify that the destination system accepts the transaction with the supplied identifier.",
      ],
    },
  },
  {
    id: 9,
    title: "Question 9",
    prompt:
      "A health system is comparing interoperability work that is mainly technical with work that is mainly process-oriented. Categorize the examples, then order the workflow for redesigning an exchange process so it better fits real care-team operations.",
    categorization: {
      buckets: ["Technical interoperability emphasis", "Process interoperability emphasis"],
      items: [
        { id: "q9c1", text: "Defining message structure so sender and receiver can parse the content correctly.", correctBucket: 0 },
        { id: "q9c2", text: "Aligning data presentation and timing with a care team's actual workflow.", correctBucket: 1 },
        { id: "q9c3", text: "Establishing a computer-to-computer connection for exchange.", correctBucket: 0 },
        { id: "q9c4", text: "Clarifying user roles so the system supports real-world operational use.", correctBucket: 1 },
        { id: "q9c5", text: "Using message format standards to encode content consistently.", correctBucket: 0 },
      ],
    },
    ordering: {
      prompt:
        "A workflow improvement team wants an exchange process to support safe and efficient care-team action rather than simply move data. Arrange the redesign steps.",
      steps: [
        "Define the care-team task or workflow problem that the exchange should support.",
        "Specify user roles, timing needs, and sequence-sensitive actions.",
        "Align the information flow and interface behavior to the real workflow.",
        "Implement the adjusted process across the connected systems.",
        "Evaluate whether the exchange now supports safer and more effective use in practice.",
      ],
    },
  },
  {
    id: 10,
    title: "Question 10",
    prompt:
      "A national exchange strategy team is differentiating local HIO functions from nationwide infrastructure functions. Categorize the examples, then order the workflow for participating in a broad exchange environment that routes information without functioning as a centralized patient-record database.",
    categorization: {
      buckets: ["Local or regional HIO function", "Nationwide exchange infrastructure function"],
      items: [
        { id: "q10c1", text: "Providing patient identity matching and direct messaging services within connected organizations.", correctBucket: 0 },
        { id: "q10c2", text: "Supporting national-scale interoperability by connecting many regional exchange participants.", correctBucket: 1 },
        { id: "q10c3", text: "Expanding reach so participating exchanges can share information beyond their immediate area.", correctBucket: 1 },
        { id: "q10c4", text: "Serving a healthcare community with exchange services tailored to its participating entities.", correctBucket: 0 },
        { id: "q10c5", text: "Routing health information securely across a broad network rather than maintaining one giant federal patient database.", correctBucket: 1 },
      ],
    },
    ordering: {
      prompt:
        "An organization wants to participate in a nationwide exchange environment to support broader interoperability. Sequence the participation logic.",
      steps: [
        "Confirm the organization's exchange purpose and participating use cases.",
        "Align with the policies and technical expectations required for network participation.",
        "Connect the organization or exchange entity to the broader exchange environment.",
        "Route the requested health information securely to the authorized participant.",
        "Use the returned information within care or coordination workflows without treating the network as a central patient-record store.",
      ],
    },
  },
];

function buildInitialResponses(): Responses {
  return assessmentBank.reduce<Responses>((acc, question) => {
    const categoryState: Record<string, number | null> = {};
    question.categorization.items.forEach((item) => {
      categoryState[item.id] = null;
    });

    acc[question.id] = {
      categorization: categoryState,
      ordering: shuffleArray(
        question.ordering.steps.map((text, index) => ({
          id: `${question.id}-step-${index}`,
          text,
          correctIndex: index,
        }))
      ),
    };

    return acc;
  }, {});
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const updated = [...list];
  const [item] = updated.splice(from, 1);
  updated.splice(to, 0, item);
  return updated;
}

function scoreQuestion(question: Question, response: QuestionResponse) {
  const categoryItems = question.categorization.items;
  const categoryCorrect = categoryItems.reduce((count, item) => {
    return count + (response.categorization[item.id] === item.correctBucket ? 1 : 0);
  }, 0);

  const orderingCorrect = response.ordering.reduce((count, step, index) => {
    return count + (step.correctIndex === index ? 1 : 0);
  }, 0);

  const categoryTotal = categoryItems.length;
  const orderingTotal = question.ordering.steps.length;
  const earned = categoryCorrect + orderingCorrect;
  const possible = categoryTotal + orderingTotal;

  const feedbackParts: string[] = [];
  if (categoryCorrect === categoryTotal) {
    feedbackParts.push("Your sorting aligned strongly with the chapter's framework.");
  } else if (categoryCorrect >= Math.ceil(categoryTotal * 0.6)) {
    feedbackParts.push("Your sorting showed partial alignment with the chapter framework.");
  } else {
    feedbackParts.push("Your sorting needs closer alignment with the chapter framework.");
  }

  if (orderingCorrect === orderingTotal) {
    feedbackParts.push("Your sequencing reflected a coherent applied workflow.");
  } else if (orderingCorrect >= Math.ceil(orderingTotal * 0.6)) {
    feedbackParts.push("Your sequencing reflected some workflow logic but needs refinement.");
  } else {
    feedbackParts.push("Your sequencing did not yet reflect a dependable workflow pattern.");
  }

  return {
    categoryCorrect,
    categoryTotal,
    orderingCorrect,
    orderingTotal,
    earned,
    possible,
    feedback: feedbackParts.join(" "),
  };
}

function getQuestionStatus(earned: number, possible: number): "Correct" | "Incorrect" {
  return earned === possible ? "Correct" : "Incorrect";
}

function runSelfChecks() {
  const moved = moveItem(["a", "b", "c"], 0, 2);
  console.assert(moved.join(",") === "b,c,a", "moveItem should move an entry to the target index");

  const sampleQuestion: Question = {
    id: 999,
    title: "Sample",
    prompt: "Sample",
    categorization: {
      buckets: ["A", "B"],
      items: [
        { id: "i1", text: "Item 1", correctBucket: 0 },
        { id: "i2", text: "Item 2", correctBucket: 1 },
      ],
    },
    ordering: {
      prompt: "Order",
      steps: ["First", "Second"],
    },
  };

  const perfectResponse: QuestionResponse = {
    categorization: { i1: 0, i2: 1 },
    ordering: [
      { id: "s1", text: "First", correctIndex: 0 },
      { id: "s2", text: "Second", correctIndex: 1 },
    ],
  };

  const imperfectResponse: QuestionResponse = {
    categorization: { i1: 1, i2: 1 },
    ordering: [
      { id: "s2", text: "Second", correctIndex: 1 },
      { id: "s1", text: "First", correctIndex: 0 },
    ],
  };

  const perfectScore = scoreQuestion(sampleQuestion, perfectResponse);
  const imperfectScore = scoreQuestion(sampleQuestion, imperfectResponse);

  console.assert(perfectScore.earned === perfectScore.possible, "Perfect responses should earn full credit");
  console.assert(imperfectScore.earned < imperfectScore.possible, "Imperfect responses should not earn full credit");
}

runSelfChecks();

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium">{children}</span>;
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm">{children}</section>;
}

export default function HouserInteroperabilityAssessmentApp() {
  const [studentName, setStudentName] = useState("");
  const [responses, setResponses] = useState<Responses>(buildInitialResponses);
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [dragState, setDragState] = useState<{ questionId: number | null; stepIndex: number | null }>({
    questionId: null,
    stepIndex: null,
  });
  const assessmentDate = useMemo(() => formatToday(), []);

  const results = useMemo(() => {
    return assessmentBank.map((question) => ({
      questionId: question.id,
      title: question.title,
      prompt: question.prompt,
      score: scoreQuestion(question, responses[question.id]),
      response: responses[question.id],
      question,
    }));
  }, [responses]);

  const overallScore = useMemo(() => {
    const earned = results.reduce((sum, result) => sum + result.score.earned, 0);
    const possible = results.reduce((sum, result) => sum + result.score.possible, 0);
    const percent = possible > 0 ? Math.round((earned / possible) * 100) : 0;
    return { earned, possible, percent };
  }, [results]);

  const updateCategorization = (questionId: number, itemId: string, bucketIndex: number | null) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        categorization: {
          ...prev[questionId].categorization,
          [itemId]: bucketIndex,
        },
      },
    }));
  };

  const handleOrderingDragStart = (questionId: number, stepIndex: number) => {
    setDragState({ questionId, stepIndex });
  };

  const handleOrderingDrop = (questionId: number, targetIndex: number) => {
    if (dragState.questionId !== questionId || dragState.stepIndex === null) {
      return;
    }

    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ordering: moveItem(prev[questionId].ordering, dragState.stepIndex as number, targetIndex),
      },
    }));

    setDragState({ questionId: null, stepIndex: null });
  };

  const moveOrderingStep = (questionId: number, from: number, to: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ordering: moveItem(prev[questionId].ordering, from, to),
      },
    }));
  };

  const handleSubmit = () => {
    if (!studentName.trim()) {
      setNameError(true);
      return;
    }

    setNameError(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="print-report mx-auto max-w-5xl rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Completion Report</h1>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Save this report as a PDF or print it for submission.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="no-print rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              Print / Save PDF
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Name</div>
              <div className="mt-1 text-base">{studentName}</div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Date</div>
              <div className="mt-1 text-base">{assessmentDate}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Competency</div>
              <div className="mt-1 text-base">{competency}</div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Bloom's Level</div>
              <div className="mt-1 text-base">{bloomLevel}</div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Score</div>
              <div className="mt-1 text-base font-semibold">
                {overallScore.earned}/{overallScore.possible} ({overallScore.percent}%)
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {results.map((result) => {
              const questionStatus = getQuestionStatus(result.score.earned, result.score.possible);

              return (
                <div key={result.questionId} className="print-break-inside-avoid rounded-2xl border p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold">{result.title}</h2>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                        questionStatus === "Correct" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {questionStatus === "Correct" ? <CheckCircle2 className="h-4 w-4" /> : <CircleX className="h-4 w-4" />}
                      {questionStatus}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-700">{result.prompt}</p>

                  <div className="mt-4 grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Answers - Part 1 Categorization</div>
                      <div className="mt-3 space-y-2 text-sm">
                        {result.question.categorization.items.map((item) => {
                          const selectedIndex = result.response.categorization[item.id];
                          const isCorrect = selectedIndex === item.correctBucket;

                          return (
                            <div key={item.id} className="rounded-xl border bg-white p-3">
                              <div className="flex items-start gap-3">
                                <div className="pt-0.5">
                                  {isCorrect ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <CircleX className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{item.text}</div>
                                  <div className="mt-1 text-slate-600">
                                    Student category: {selectedIndex === null ? "No selection" : result.question.categorization.buckets[selectedIndex]}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm font-medium">
                        {result.score.categoryCorrect === result.score.categoryTotal ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <CircleX className="h-5 w-5 text-red-600" />
                        )}
                        <span>
                          Part 1 Score: {result.score.categoryCorrect}/{result.score.categoryTotal} {result.score.categoryCorrect === result.score.categoryTotal ? "(Correct)" : "(Incorrect)"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Answers - Part 2 Ordering</div>
                      <ol className="mt-3 space-y-2 text-sm">
                        {result.response.ordering.map((step, index) => {
                          const isCorrect = step.correctIndex === index;

                          return (
                            <li key={step.id} className="rounded-xl border bg-white p-3">
                              <div className="flex items-start gap-3">
                                <div className="pt-0.5">
                                  {isCorrect ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <CircleX className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <span className="font-semibold">Step {index + 1}:</span> {step.text}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ol>

                      <div className="mt-3 flex items-center gap-2 text-sm font-medium">
                        {result.score.orderingCorrect === result.score.orderingTotal ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <CircleX className="h-5 w-5 text-red-600" />
                        )}
                        <span>
                          Part 2 Score: {result.score.orderingCorrect}/{result.score.orderingTotal} {result.score.orderingCorrect === result.score.orderingTotal ? "(Correct)" : "(Incorrect)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border-l-4 border-slate-400 bg-slate-50 p-4">
                    <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Feedback</div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{result.score.feedback}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <SectionCard>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold tracking-tight">Interoperability and HIE Assessment</h1>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Complete all ten items. Each item includes a categorization task and a drag-and-drop ordering task.
              </p>
            </div>
            <Pill>{bloomLevel}</Pill>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
              <input
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (e.target.value.trim()) {
                    setNameError(false);
                  }
                }}
                aria-required="true"
                className="w-full rounded-xl border px-4 py-3 outline-none ring-0 transition focus:border-slate-900"
                placeholder="Enter your name"
              />
              {nameError && <div className="mt-2 text-sm font-medium text-red-600">Name is required before submitting the assessment.</div>}
            </label>

            <div>
              <span className="mb-2 block text-sm font-semibold text-slate-700">Date</span>
              <div className="rounded-xl border bg-slate-50 px-4 py-3">{assessmentDate}</div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Competency</div>
            <div className="mt-2 text-sm leading-6 text-slate-800">{competency}</div>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Learning Objectives</div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
              {learningObjectives.map((objective) => (
                <li key={objective} className="rounded-xl border bg-white px-3 py-2">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>

        {assessmentBank.map((question) => {
          const response = responses[question.id];

          return (
            <SectionCard key={question.id}>
              <h2 className="text-2xl font-semibold">{question.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{question.prompt}</p>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Part 1 - Categorization</div>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {question.categorization.buckets.map((bucket, bucketIndex) => (
                      <div
                        key={bucket}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const itemId = e.dataTransfer.getData("text/plain");
                          if (itemId) {
                            updateCategorization(question.id, itemId, bucketIndex);
                          }
                        }}
                        className="min-h-[150px] rounded-2xl border bg-white p-4"
                      >
                        <div className="mb-2 text-sm font-semibold">{bucket}</div>
                        {question.categorization.items
                          .filter((item) => response.categorization[item.id] === bucketIndex)
                          .map((item) => (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
                              className="mb-2 cursor-move rounded-xl border bg-slate-50 p-2 text-sm"
                            >
                              {item.text}
                            </div>
                          ))}
                      </div>
                    ))}

                    <div className="md:col-span-2">
                      <div className="mb-2 text-sm font-semibold">Unassigned</div>
                      <div
                        className="min-h-[100px] rounded-2xl border bg-slate-50 p-4"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const itemId = e.dataTransfer.getData("text/plain");
                          if (itemId) {
                            updateCategorization(question.id, itemId, null);
                          }
                        }}
                      >
                        {question.categorization.items
                          .filter((item) => response.categorization[item.id] === null)
                          .map((item) => (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
                              className="mb-2 cursor-move rounded-xl border bg-white p-2 text-sm"
                            >
                              {item.text}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">Part 2 - Ordering</div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{question.ordering.prompt}</p>
                  <div className="mt-4 space-y-3">
                    <AnimatePresence initial={false}>
                      {response.ordering.map((step, index) => (
                        <motion.div
                          key={step.id}
                          layout
                          draggable
                          onDragStart={() => handleOrderingDragStart(question.id, index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleOrderingDrop(question.id, index)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.7 }}
                          className="flex items-center justify-between rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="cursor-grab px-2 text-slate-400 active:cursor-grabbing">⋮⋮</div>
                            <div className="text-sm leading-6 text-slate-800">
                              <span className="mr-2 font-semibold">{index + 1}.</span>
                              {step.text}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (index === 0) return;
                                moveOrderingStep(question.id, index, index - 1);
                              }}
                              className="rounded-full border px-2 py-1 text-sm hover:bg-slate-100"
                              aria-label={`Move step ${index + 1} up`}
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (index === response.ordering.length - 1) return;
                                moveOrderingStep(question.id, index, index + 1);
                              }}
                              className="rounded-full border px-2 py-1 text-sm hover:bg-slate-100"
                              aria-label={`Move step ${index + 1} down`}
                            >
                              ▼
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </SectionCard>
          );
        })}

        <div className="pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!studentName.trim()}
            className={`w-full rounded-2xl px-5 py-4 text-base font-semibold text-white shadow-sm transition ${
              studentName.trim() ? "bg-slate-900 hover:opacity-95" : "cursor-not-allowed bg-slate-400"
            }`}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

