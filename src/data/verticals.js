export const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
  'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
  'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
  'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'
];

export const STATE_ABBR = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA','Colorado':'CO',
  'Connecticut':'CT','Delaware':'DE','District of Columbia':'DC','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY',
  'Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN',
  'Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH',
  'New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND',
  'Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA',
  'Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'
};

export const VERTICALS = {
  retail: {
    id: 'retail',
    name: 'Retail',
    icon: '🛒',
    description: 'Stores, pharmacies, specialty retail',
    roles: ['Cashier / Register', 'Floor / Sales', 'Stockroom', 'Pharmacy Tech', 'Shift Lead'],
    scenarioLabel: 'Common situations managers face',
    scenarios: [
      {
        text: "A store associate told me their former partner has been showing up outside the store and they're scared to leave at night. We're in Texas.",
        tag: 'Partner Stalking · Texas',
        state: 'Texas'
      },
      {
        text: "One of my night-shift workers disclosed that a co-worker has been sending threatening messages. The employee works at our California location.",
        tag: 'Workplace Harassment · California',
        state: 'California'
      },
      {
        text: "A team member asked me to change their schedule so they don't overlap with someone they have a protection order against. New York.",
        tag: 'Protection Order · New York',
        state: 'New York'
      },
      {
        text: "An employee came to me visibly distressed after receiving threatening calls at work from someone they know. Illinois store.",
        tag: 'Safety Concern · Illinois',
        state: 'Illinois'
      }
    ]
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Hospitals, clinics, medical centers',
    roles: ['Registered Nurse', 'Charge Nurse', 'Medical Tech', 'Administrative Staff', 'Floor Supervisor'],
    scenarioLabel: 'Common situations managers face',
    scenarios: [
      {
        text: "A charge nurse disclosed to me that a patient's family member has been threatening them outside the hospital. We're in California.",
        tag: 'Patient Family Threat · California',
        state: 'California'
      },
      {
        text: "An ER worker mentioned they're in a dangerous home situation and it's affecting their ability to focus at work. Texas hospital.",
        tag: 'Domestic Disclosure · Texas',
        state: 'Texas'
      },
      {
        text: "A floor supervisor asked me what our mandatory reporting obligations are when a staff member discloses domestic violence. New York.",
        tag: 'Mandatory Reporting · New York',
        state: 'New York'
      },
      {
        text: "A staff member disclosed they're experiencing intimate partner violence and asked whether HR needs to be told. Illinois.",
        tag: 'Confidential Disclosure · Illinois',
        state: 'Illinois'
      }
    ]
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Plants, factories, production floors',
    roles: ['Line Operator', 'Floor Supervisor', 'Maintenance Tech', 'Shift Lead', 'Quality Control'],
    scenarioLabel: 'Common situations managers face',
    scenarios: [
      {
        text: "A worker on my floor approached me saying their ex-partner has been waiting for them in the parking lot after shifts. Texas plant.",
        tag: 'Parking Lot Safety · Texas',
        state: 'Texas'
      },
      {
        text: "One of my shift leads thinks a team member might be in a dangerous situation at home based on their behavior and visible injuries. Michigan.",
        tag: 'Suspected DV · Michigan',
        state: 'Michigan'
      },
      {
        text: "A worker needs to leave early three days a week for court hearings related to a protection order. Ohio.",
        tag: 'Court Accommodation · Ohio',
        state: 'Ohio'
      },
      {
        text: "A line supervisor asked me what I'm legally required to do after an employee discloses domestic violence. California.",
        tag: 'Legal Obligations · California',
        state: 'California'
      }
    ]
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality',
    icon: '🏨',
    description: 'Hotels, resorts, food & beverage',
    roles: ['Front Desk Agent', 'Housekeeping', 'F&B Staff', 'Night Manager', 'Concierge'],
    scenarioLabel: 'Common situations managers face',
    scenarios: [
      {
        text: "A front desk employee told me a guest has been making threatening comments toward them. I'm not sure if this is reportable. Nevada.",
        tag: 'Guest Threat · Nevada',
        state: 'Nevada'
      },
      {
        text: "One of our hotel workers asked about their rights when it comes to requesting a schedule change for a safety reason. Florida.",
        tag: 'Schedule Accommodation · Florida',
        state: 'Florida'
      },
      {
        text: "An F&B team member disclosed that they're being harassed by a co-worker and they're afraid to come in. California.",
        tag: 'Co-worker Harassment · California',
        state: 'California'
      },
      {
        text: "My night manager told me a team member disclosed a domestic situation and asked me to keep it quiet. Not sure what I can and can't share. New York.",
        tag: 'Confidentiality · New York',
        state: 'New York'
      }
    ]
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    icon: '🏢',
    description: 'HQ, HR, employee relations, compliance',
    roles: ['HR Business Partner', 'Employee Relations Specialist', 'Recruiter / Account Manager', 'Regional Director', 'Compliance Officer'],
    scenarioLabel: 'Common situations HR leaders manage',
    scenarios: [
      {
        text: "A recruiter reported that a travel nurse on a 13-week assignment in Texas was grabbed by a patient during a night shift. The hospital hasn't filed an incident report. What are our obligations as the staffing employer?",
        tag: 'Patient Violence · Staffing Obligation · Texas',
        state: 'Texas'
      },
      {
        text: "A store manager in our California location escalated a GBV disclosure. Employee ID EMP-2847 has requested schedule accommodation and has a court date next week. What should HR do next?",
        tag: 'Escalated Disclosure · California',
        state: 'California'
      },
      {
        text: "An employee relations case involves a placed nurse in Illinois who wants to break her contract after a violent incident. Before we process the break, what documentation do we need and what are our legal obligations?",
        tag: 'Contract Break · Illinois',
        state: 'Illinois'
      },
      {
        text: "A regional director flagged that a hospital client in New York isn't following incident reporting procedures after one of our placed providers was threatened by a patient's family member. What are our obligations?",
        tag: 'Client Facility Compliance · New York',
        state: 'New York'
      }
    ]
  }
};

export const QUICK_LAUNCH_PROFILES = [
  {
    id: 'retail-demo',
    orgName: 'National Pharmacy Chain',
    industry: 'retail',
    state: 'California',
    locationId: 'Store #4821',
    city: 'Fresno',
    display: 'National Pharmacy Chain · Store #4821 · Fresno, CA'
  },
  {
    id: 'healthcare-demo',
    orgName: 'Regional Medical Center',
    industry: 'healthcare',
    state: 'Florida',
    locationId: 'Main Campus',
    city: 'West Palm Beach',
    display: 'Regional Medical Center · West Palm Beach, FL'
  },
  {
    id: 'manufacturing-demo',
    orgName: 'Advanced Manufacturing Facility',
    industry: 'manufacturing',
    state: 'Texas',
    locationId: 'Plant ATX',
    city: 'Austin',
    display: 'Advanced Manufacturing Facility · Austin, TX'
  },
  {
    id: 'hospitality-demo',
    orgName: 'Luxury Hotel & Resort',
    industry: 'hospitality',
    state: 'Nevada',
    locationId: 'LV Property',
    city: 'Las Vegas',
    display: 'Luxury Hotel & Resort · Las Vegas, NV'
  },
  {
    id: 'corporate-demo',
    orgName: 'Healthcare Staffing Corp',
    industry: 'corporate',
    state: 'Utah',
    locationId: 'Corporate HR',
    city: 'Midvale',
    display: 'Healthcare Staffing Corp · Corporate HR · Midvale, UT'
  }
];
