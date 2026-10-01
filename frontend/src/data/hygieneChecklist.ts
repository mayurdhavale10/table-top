// Sourced verbatim from FSSAI's official "Hygiene Rating Checklist for Food Service
// Establishments/Bakery/Restaurants" (hygiene.fssai.gov.in/resources/sample_checklist.pdf).
// Critical (starred) items cause automatic non-compliance if answered "No", per FSSAI's own rule:
// "Failure in any of the asterisk mark questions will lead to Non-compliance."

export type EvidenceType = "document" | "live_photo";

export type EvidenceConfig = {
  type: EvidenceType;
  label: string;
  expiryMonths?: number; // if set, the attached evidence has a "valid until" date to track
};

export type ChecklistQuestion = {
  id: number;
  text: string;
  note?: string;
  points: 2 | 4;
  critical: boolean;
  evidence?: EvidenceConfig;
};

export type ChecklistSection = {
  section: string;
  questions: ChecklistQuestion[];
};

export const HYGIENE_CHECKLIST: ChecklistSection[] = [
  {
    section: "General Requirements",
    questions: [
      {
        id: 1,
        text: "The FSSAI license/Registration and Food Safety Display Board (FSDB) both are displayed at a prominent location.",
        note: "The FSDBs are readable to both Food Handlers and Customers.",
        points: 2,
        critical: false,
        evidence: { type: "document", label: "FSSAI license / FSDB photo" },
      },
    ],
  },
  {
    section: "Design & Facilities",
    questions: [
      { id: 2, text: "The food premise is located in a hygienic environment. The design provides adequate working space; permits maintenance & cleaning to prevent the entry of dirt, dust & pests.", points: 2, critical: false },
      { id: 3, text: "Internal structures & fittings are made of non-toxic and impermeable material.", points: 2, critical: false },
      { id: 4, text: "Walls, ceilings & doors are free from flaking paint or plaster, condensation & shedding particles.", points: 2, critical: false },
      { id: 5, text: "Floors are non-absorbent, non-slippery & sloped appropriately.", points: 2, critical: false },
      { id: 6, text: "Windows are kept closed & fitted with insect proof screens when opening to an external environment.", points: 2, critical: false },
      { id: 7, text: "Doors are smooth and non-absorbent. Suitable precautions have been taken to prevent the entry of pests.", points: 2, critical: false },
      {
        id: 8,
        text: "Potable water (meeting standards of IS:10500, tested semi-annually with records maintained) is used as a product ingredient or in contact with food/food contact surfaces.",
        note: "Not mandatory if using Municipal Corporation water, subject to maintaining water bill records.",
        points: 4,
        critical: true,
        evidence: { type: "document", label: "Water testing lab report", expiryMonths: 6 },
      },
      { id: 9, text: "Equipment and containers are made of non-toxic, impervious, non-corrosive material which is easy to clean & disinfect.", points: 2, critical: false },
      { id: 10, text: "Adequate facilities for heating, cooling, refrigeration and freezing food & facilitate monitoring of temperature.", points: 2, critical: false },
      { id: 11, text: "The premise has sufficient lighting. Lighting fixtures are protected to prevent contamination on breakage.", points: 2, critical: false },
      { id: 12, text: "Adequate ventilation is provided within the premise.", points: 2, critical: false },
      { id: 13, text: "An adequate storage facility for food, packaging materials, chemicals, personnel items etc. is available.", points: 2, critical: false },
      { id: 14, text: "Personnel hygiene facilities are available including an adequate number of hand washing facilities, toilets, and changing rooms for employees.", points: 2, critical: false },
      { id: 15, text: "Food material is tested either through an internal laboratory or through an accredited lab. Check for records.", points: 2, critical: false },
    ],
  },
  {
    section: "Control of Operations",
    questions: [
      { id: 16, text: "Incoming material is procured as per internally laid down specification from approved vendors. Check for records (certificate of analysis, Form E, specifications, supplier details, batch no., mfg./expiry date, quantity). Only permitted colors and flavors are used.", points: 2, critical: false, evidence: { type: "document", label: "Vendor invoice / Certificate of Analysis" } },
      { id: 17, text: "Raw materials are inspected at the time of receiving for food safety hazards. Raw and finished products are free from visible adulteration.", points: 2, critical: false },
      { id: 18, text: "Incoming material, semi or final products are stored according to their temperature requirement in a hygienic environment. FIFO & FEFO is practiced.", points: 2, critical: false },
      { id: 19, text: "Foods of animal origin are stored at a temperature less than or equal to 4°C.", points: 2, critical: false },
      { id: 20, text: "All raw materials are cleaned thoroughly before food preparation.", points: 2, critical: false },
      { id: 21, text: "Proper segregation of raw, semi-processed and cooked, vegetarian and non-vegetarian food is done.", points: 2, critical: false },
      { id: 22, text: "All equipment is adequately sanitized before and after food preparation.", points: 2, critical: false },
      {
        id: 23,
        text: "Frozen food is thawed hygienically. No thawed food is stored for later use.",
        note: "Meat/fish/poultry thawed in refrigerator at 5°C or below, or in microwave. Shellfish thawed in cold potable running water at 15°C or below within 90 minutes.",
        points: 4,
        critical: true,
      },
      {
        id: 24,
        text: "Vegetarian items are cooked to a minimum of 60°C for 10 minutes or 65°C for 2 minutes core food temperature. Non-vegetarian items are cooked to a minimum of 65°C for 10 minutes, 70°C for 2 minutes, or 75°C for 15 seconds core food temperature.",
        points: 4,
        critical: true,
      },
      {
        id: 25,
        text: "Cooked food intended for refrigeration is cooled appropriately.",
        note: "High risk food is cooled from 60°C to 21°C within 2 hours or less, and further cooled to 5°C within two hours or less.",
        points: 4,
        critical: true,
      },
      { id: 26, text: "Food portioning is done in hygienic conditions. High risk food is portioned in a refrigerated area or refrigerated within 30 minutes.", points: 2, critical: false },
      {
        id: 27,
        text: "Hot food intended for consumption is held at 65°C (non-veg 70°C). Cold foods are maintained at 5°C or below and frozen products at -18°C or below.",
        points: 4,
        critical: true,
      },
      {
        id: 28,
        text: "Reheating is done appropriately with no indirect methods (adding hot water, bain-marie, or lamp). Core temperature reaches 75°C for at least 2 minutes.",
        points: 4,
        critical: true,
      },
      { id: 29, text: "Oil being used is suitable for cooking purposes. Periodic verification of fat and oil by checking color, flavor and floated elements.", points: 2, critical: false, evidence: { type: "live_photo", label: "Oil TPC test strip/meter reading" } },
      { id: 30, text: "Unused/fresh oil with not more than 15% Total Polar Compounds (TPC), and used oil with not more than 25% TPC, is used for food preparation.", points: 2, critical: false },
      { id: 31, text: "Appropriate records are maintained if oil consumption is more than 50 L/day.", points: 2, critical: false },
      {
        id: 32,
        text: "Vehicles intended for food transportation are kept clean, maintained in good repair, and maintain required temperature.",
        note: "Hot foods held at 65°C, cold foods at 5°C, frozen items at -18°C during transportation, or transported within 2 hours of food preparation.",
        points: 4,
        critical: true,
      },
      { id: 33, text: "Food and non-food products transported at the same time in the same vehicle are separated adequately to avoid risk to food.", points: 2, critical: false },
      { id: 34, text: "Cutlery and crockery used for serving are clean and sanitized, free from unhygienic matter.", points: 2, critical: false },
      { id: 35, text: "Packaging and wrapping materials coming in contact with food are clean and of food grade quality. Newspaper is not used for storing/wrapping food.", points: 2, critical: false },
      { id: 36, text: "Labelling of food items is as per FSSAI norms. Shelf life of food products indicated properly.", points: 2, critical: false },
    ],
  },
  {
    section: "Maintenance & Sanitation",
    questions: [
      { id: 37, text: "Cleaning of equipment and food premise is done as per a cleaning schedule/programme. No stagnation of water in food zones.", points: 2, critical: false },
      { id: 38, text: "Preventive maintenance of equipment and machinery is carried out regularly as per manufacturer instructions. Check for records.", points: 2, critical: false },
      { id: 39, text: "Measuring & monitoring devices are calibrated periodically.", points: 2, critical: false },
      { id: 40, text: "Pest control program is available & pest control activities are carried out by trained and experienced personnel. Check for records.", points: 2, critical: false },
      { id: 41, text: "No signs of pest activity or infestation in premises (eggs, larvae, feces etc.)", points: 4, critical: true, evidence: { type: "document", label: "Pest control agency's visit report", expiryMonths: 3 } },
      { id: 42, text: "Drains are designed to meet expected flow loads and equipped with grease and cockroach traps.", points: 2, critical: false },
      { id: 43, text: "Food waste and other refuse are removed periodically from food handling areas to avoid accumulation.", points: 2, critical: false },
    ],
  },
  {
    section: "Personal Hygiene",
    questions: [
      { id: 44, text: "Annual medical examination & inoculation of food handlers against the enteric group of diseases is done as per recommended schedule. Check for records.", points: 2, critical: false, evidence: { type: "document", label: "Staff medical certificate", expiryMonths: 12 } },
      { id: 45, text: "No person suffering from a disease or illness, or with open wounds or burns, is involved in handling food or food-contact materials.", points: 2, critical: false },
      {
        id: 46,
        text: "Food handlers maintain personal cleanliness (clean clothes, trimmed nails, waterproof bandages) and personal behavior (hand washing, no loose jewellery, no smoking, no spitting).",
        points: 4,
        critical: true,
        evidence: { type: "live_photo", label: "Staff hygiene / PPE photo" },
      },
      { id: 47, text: "Food handlers are equipped with suitable aprons, gloves, headgear etc. wherever necessary.", points: 2, critical: false },
    ],
  },
  {
    section: "Training & Records Keeping",
    questions: [
      { id: 48, text: "Internal / External audit of the system is done periodically. Check for records.", points: 2, critical: false },
      { id: 49, text: "Food Business has an effective consumer complaints redressal mechanism.", points: 2, critical: false },
      { id: 50, text: "Food handlers have the necessary knowledge and skills & are trained to handle food safely. Check for training records.", points: 2, critical: false, evidence: { type: "document", label: "FoSTaC training certificate" } },
      {
        id: 51,
        text: "Appropriate documentation & records are available and retained for a period of one year (or as applicable), whichever is more.",
        points: 4,
        critical: true,
      },
    ],
  },
];

export const HYGIENE_MAX_SCORE = HYGIENE_CHECKLIST.flatMap((s) => s.questions).reduce(
  (sum, q) => sum + q.points,
  0
); // 122

export function computeHygieneScore(responses: Record<number, "yes" | "no" | "na">) {
  const allQuestions = HYGIENE_CHECKLIST.flatMap((s) => s.questions);
  let earned = 0;
  let possible = 0;
  let hasCriticalFailure = false;

  for (const q of allQuestions) {
    const answer = responses[q.id];
    if (answer === "na") continue;
    possible += q.points;
    if (answer === "yes") earned += q.points;
    if (answer === "no" && q.critical) hasCriticalFailure = true;
  }

  const percentage = possible > 0 ? (earned / possible) * 100 : 0;

  let starRating: number;
  if (hasCriticalFailure) {
    starRating = 1;
  } else if (percentage >= 90) {
    starRating = 5;
  } else if (percentage >= 75) {
    starRating = 4;
  } else if (percentage >= 60) {
    starRating = 3;
  } else if (percentage >= 40) {
    starRating = 2;
  } else {
    starRating = 1;
  }

  return { earned, possible, percentage, starRating, hasCriticalFailure };
}

export function getEvidenceEligibleQuestions() {
  return HYGIENE_CHECKLIST.flatMap((s) => s.questions).filter((q) => q.evidence);
}

export function computeCriticalEvidenceStats(evidenceByQuestion: Record<number, { url: string } | undefined>) {
  const criticalWithEvidence = HYGIENE_CHECKLIST.flatMap((s) => s.questions).filter(
    (q) => q.critical && q.evidence
  );
  const verifiedCount = criticalWithEvidence.filter((q) => evidenceByQuestion[q.id]?.url).length;
  return { total: criticalWithEvidence.length, verified: verifiedCount };
}

export const STAR_LABELS: Record<number, string> = {
  5: "Excellent",
  4: "Very Good",
  3: "Good",
  2: "Needs Improvement",
  1: "Requires Urgent Improvement",
};
