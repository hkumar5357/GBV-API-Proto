// Mock responses keyed by scenario text prefix (first ~40 chars) or a scenario key.
// Each entry mirrors the real API schema.

const base = (overrides) => ({
  guidance: '',
  jurisdiction: 'Unknown — jurisdiction required',
  citations: [],
  clarification_questions: [],
  next_steps: [],
  mandatory_reporting: false,
  sources: [],
  segments_found: 4,
  search_latency: 1.2,
  ...overrides
});

// Build a library of realistic scenario responses by state & industry.
export const MOCK_RESPONSES = [
  // ---------- RETAIL ----------
  {
    match: 'former partner has been showing up outside the store',
    response: base({
      jurisdiction: 'Texas',
      guidance: "Your employee has rights under Texas law to request safety accommodations at work when facing stalking or intimate partner violence. As their manager, your first priority is their immediate physical safety. Texas Labor Code § 21.003 and § 21.051 prohibit employment discrimination and require reasonable accommodations for DV victims in many circumstances. Consider offering to adjust the employee's shift, provide escorts to their vehicle at shift-end, and ensure the store's security team is briefed on a person-of-concern. Do not share the employee's specific situation broadly — only security personnel with a need-to-know should be informed. Document the disclosure privately with date, time, and actions offered. If the employee has a protective order, request a copy to keep on file and share with security. If the partner enters the premises, call 911 first and your district manager second.",
      citations: [
        { statute: 'Tex. Lab. Code § 21.003', description: 'Employment discrimination protections' },
        { statute: 'Tex. Code Crim. Proc. Art. 56.81', description: 'Victim employment leave for legal proceedings' }
      ],
      clarification_questions: [
        'Has the partner physically entered the store premises?',
        'Does the employee have an existing protective order?',
        'Is the employee requesting a specific schedule change?'
      ],
      next_steps: [
        'Document the disclosure privately with date, time, and summary',
        'Offer an immediate schedule adjustment away from predictable shift patterns',
        'Brief on-site security with a person-of-concern description (no employee PII)',
        'Provide contact info for the National DV Hotline (1-800-799-7233) and local EAP',
        'Confirm whether a protective order exists and request a copy for security'
      ],
      sources: [
        { title: 'Texas Workforce Commission — Employer Guidance', source_url: 'https://www.twc.texas.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'co-worker has been sending threatening messages',
    response: base({
      jurisdiction: 'California',
      guidance: "Under California law, this situation triggers both harassment and workplace violence obligations. California Labor Code § 6401.9 (SB 553) requires employers to have a Workplace Violence Prevention Plan and to investigate credible threats. The employee's disclosure qualifies as a reportable incident under your plan. You must separate the alleged harasser from the reporting employee during investigation — typically by adjusting schedules or work areas — without retaliation against the reporting employee. Preserve any messages as evidence. Cal. Gov. Code § 12940 prohibits retaliation for reporting harassment. Engage HR and, if threats are credible or imminent, contact law enforcement. The reporting employee may also be entitled to protected time off under Cal. Lab. Code § 230.",
      citations: [
        { statute: 'Cal. Lab. Code § 6401.9', description: 'Workplace Violence Prevention Plan (SB 553)' },
        { statute: 'Cal. Gov. Code § 12940', description: 'FEHA harassment & retaliation prohibitions' },
        { statute: 'Cal. Lab. Code § 230', description: 'Protected leave for victims of crime or abuse' }
      ],
      clarification_questions: [
        'Has the employee preserved copies of the threatening messages?',
        'Is the alleged harasser currently on shift with the reporting employee?',
        'Has the employee requested a transfer or schedule change?'
      ],
      next_steps: [
        'Separate the two employees on the schedule immediately',
        'Preserve all message evidence (screenshots, timestamps)',
        'Open a formal harassment investigation under your SB 553 plan',
        'Issue a no-retaliation reminder to all involved parties',
        'Engage HR and legal before any disciplinary action'
      ],
      sources: [
        { title: 'Cal/OSHA Workplace Violence Prevention Guidance', source_url: 'https://www.dir.ca.gov/dosh/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'protection order',
    response: base({
      jurisdiction: 'New York',
      guidance: "New York State law provides strong protections for DV victims in the workplace. Under N.Y. Labor Law § 196-b and N.Y. Exec. Law § 296, employers must provide reasonable accommodations including schedule changes, transfers, and time off for court proceedings. You are required to engage in an interactive process with the employee. Request a copy of the protection order (a court-issued document is sufficient proof) and keep it in a confidential file separate from the employee's personnel record. Adjust the schedule to eliminate overlap with the named individual. If both parties work for you, you must separate them while the order is active. Do not disclose the reason for the accommodation to other employees.",
      citations: [
        { statute: 'N.Y. Exec. Law § 296(22)', description: 'Reasonable accommodations for DV victims' },
        { statute: 'N.Y. Labor Law § 196-b', description: 'Paid safe leave for DV, stalking, sexual assault' }
      ],
      clarification_questions: [
        'Does the other party named in the order also work at this location?',
        'How many hours per week of accommodation does the employee need?',
        'Has the employee provided a copy of the protection order?'
      ],
      next_steps: [
        'Collect a copy of the protection order for confidential HR file',
        'Adjust the schedule to eliminate overlap with the named individual',
        'Log accommodation as interactive-process documentation',
        'Provide information on NY paid safe leave under § 196-b',
        'Review the schedule weekly until the order expires'
      ],
      sources: [
        { title: 'NY DHR — Workplace Protections for DV Victims', source_url: 'https://dhr.ny.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'threatening calls at work',
    response: base({
      jurisdiction: 'Illinois',
      guidance: "Under the Illinois Victims' Economic Security and Safety Act (VESSA), your employee is entitled to up to 12 weeks of unpaid leave and reasonable safety accommodations. 820 ILCS 180 requires the employer to engage in an interactive process and provide accommodations like screening calls, a private workspace, or a schedule change. You are not permitted to require the employee to disclose details beyond what is needed to verify the need for accommodation. If threats are imminent, involve law enforcement and store security. Keep documentation in a confidential file. Illinois also permits the employee to take time off to seek a protection order or attend court.",
      citations: [
        { statute: '820 ILCS 180', description: "Victims' Economic Security and Safety Act (VESSA)" },
        { statute: '775 ILCS 5/2-109', description: 'IL Human Rights Act — workplace protections' }
      ],
      clarification_questions: [
        'Are the calls coming to the employee\'s personal line or a store line?',
        'Has the employee filed a police report about the threats?',
        'Is a call-screening or phone reassignment accommodation feasible?'
      ],
      next_steps: [
        'Offer VESSA-protected time off if needed',
        'Enable call screening or reassign phone duties',
        'Document the disclosure and accommodations offered',
        'Provide DV resource information (IL DV Hotline: 1-877-863-6338)',
        'Coordinate with security if threats escalate'
      ],
      sources: [
        { title: 'Illinois DOL — VESSA Guidance', source_url: 'https://labor.illinois.gov/' }
      ],
      mandatory_reporting: false
    })
  },

  // ---------- HEALTHCARE ----------
  {
    match: "patient's family member has been threatening",
    response: base({
      jurisdiction: 'California',
      guidance: "This situation falls squarely under California's Workplace Violence Prevention in Healthcare standard (Cal. Code Regs. tit. 8, § 3342) and SB 553 (Cal. Lab. Code § 6401.9). Your hospital is required to log this as a Type II workplace violence incident (patient/family member perpetrator) and include it in the Violent Incident Log. The charge nurse should not return to assignments where contact with the family member is likely until a safety assessment is complete. Engage security to assess whether a trespass notice or escort is warranted. Document the threats with date, time, and verbatim content where possible. Consider temporarily reassigning the nurse to a different unit. Cal/OSHA requires post-incident response including offering counseling/EAP.",
      citations: [
        { statute: 'Cal. Code Regs. tit. 8, § 3342', description: 'Workplace Violence Prevention in Healthcare' },
        { statute: 'Cal. Lab. Code § 6401.9', description: 'Workplace Violence Prevention Plan (SB 553)' }
      ],
      clarification_questions: [
        'Has the family member been issued a trespass notice?',
        'Is the patient still admitted to the hospital?',
        'Does the charge nurse want temporary reassignment?'
      ],
      next_steps: [
        'Log incident in the hospital Violent Incident Log (§ 3342)',
        'Offer temporary reassignment to a different unit',
        'Coordinate with hospital security for trespass notice',
        'Offer EAP/counseling services per Cal/OSHA post-incident protocol',
        'Debrief with the nurse and document safety plan'
      ],
      sources: [
        { title: 'Cal/OSHA Healthcare Workplace Violence Standard', source_url: 'https://www.dir.ca.gov/title8/3342.html' }
      ],
      mandatory_reporting: true
    })
  },
  {
    match: 'dangerous home situation',
    response: base({
      jurisdiction: 'Texas',
      guidance: "Texas does not have a specific state DV-leave statute like California or New York, but federal protections (FMLA, where eligible) and Texas Code of Criminal Procedure Art. 56.81 apply. As a healthcare manager, your first obligation is the employee's safety and wellbeing, followed by patient-care quality. If the employee is struggling to focus, temporary reassignment to a lower-acuity area is appropriate. Provide EAP information and DV resources (National DV Hotline 1-800-799-7233). Do NOT require disclosure details. Document only the accommodations requested and provided. Texas hospitals typically have Employee Assistance Programs and should engage Occupational Health if there's any indication of injury.",
      citations: [
        { statute: 'Tex. Code Crim. Proc. Art. 56.81', description: 'Leave for crime-victim court proceedings' },
        { statute: '29 U.S.C. § 2612 (FMLA)', description: 'Federal medical leave where eligible' }
      ],
      clarification_questions: [
        'Is the employee seeking time off, or an accommodation to stay at work?',
        'Has the employee disclosed any physical injury?',
        'Would temporary reassignment to a different unit help?'
      ],
      next_steps: [
        'Offer EAP referral and DV hotline information',
        'Consider temporary reassignment to lower-acuity duties',
        'Explore FMLA eligibility if leave is needed',
        'Document only accommodations, not disclosure details',
        'Schedule a follow-up check-in within one week'
      ],
      sources: [
        { title: 'Texas Health and Human Services — Workplace DV', source_url: 'https://www.hhs.texas.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'mandatory reporting obligations',
    response: base({
      jurisdiction: 'New York',
      guidance: "New York does NOT impose a general mandatory reporting duty on employers or supervisors for adult-on-adult domestic violence. Healthcare providers have mandatory reporting duties for certain injuries (e.g., gunshot, stab wounds under N.Y. Penal Law § 265.25) and child/elder abuse, but DV between adult partners is not itself reportable absent those specific circumstances. Respecting the employee's autonomy is critical — pressuring disclosure or reporting against their wishes can increase danger. You DO have obligations to provide reasonable accommodations under N.Y. Exec. Law § 296(22) and paid safe leave under N.Y. Labor Law § 196-b. If the employee is also a clinician whose patient is a DV victim, separate clinician-patient reporting duties apply.",
      citations: [
        { statute: 'N.Y. Penal Law § 265.25', description: 'Mandatory reporting of specific injuries' },
        { statute: 'N.Y. Exec. Law § 296(22)', description: 'Accommodations for DV victims' },
        { statute: 'N.Y. Soc. Serv. Law § 413', description: 'Child abuse reporting (separate)' }
      ],
      clarification_questions: [
        'Are there injuries that would trigger separate clinician-reporting duties?',
        'Is the staff member seeking accommodation or leave?',
        'Does your facility have a DV liaison?'
      ],
      next_steps: [
        'Do not report against the employee\'s wishes — DV is not itself reportable',
        'Confirm whether any separate mandatory-reporting triggers apply (injuries, minors)',
        'Offer accommodations under N.Y. Exec. Law § 296(22)',
        'Provide information on NY paid safe leave (§ 196-b)',
        'Connect with facility DV liaison if available'
      ],
      sources: [
        { title: 'NY Office for the Prevention of DV — Employer Toolkit', source_url: 'https://opdv.ny.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'intimate partner violence and asked whether HR',
    response: base({
      jurisdiction: 'Illinois',
      guidance: "Under Illinois VESSA (820 ILCS 180) and the Illinois Human Rights Act, an employee's disclosure of intimate partner violence is confidential and should only be shared with HR on a need-to-know basis for accommodation purposes. Illinois does NOT generally require supervisors to escalate the disclosure itself to HR absent a request for protected leave or accommodation. Respect the employee's stated preference to keep the disclosure limited. If accommodations are needed, loop in HR only to the extent necessary to implement them. Document any accommodations in a confidential file separate from the personnel record. The employee has the right to up to 12 weeks of VESSA leave if they request it.",
      citations: [
        { statute: '820 ILCS 180', description: "Victims' Economic Security and Safety Act" },
        { statute: '775 ILCS 5', description: 'Illinois Human Rights Act' }
      ],
      clarification_questions: [
        'Is the employee requesting any workplace accommodation?',
        'Does the employee need protected leave?',
        'Would the employee consent to a confidential conversation with HR?'
      ],
      next_steps: [
        'Respect the employee\'s confidentiality preference',
        'Loop in HR only if accommodations require it',
        'Document any accommodations in a separate confidential file',
        'Provide VESSA information if leave may be needed',
        'Offer EAP and IL DV Hotline (1-877-863-6338)'
      ],
      sources: [
        { title: 'Illinois Department of Labor — VESSA', source_url: 'https://labor.illinois.gov/' }
      ],
      mandatory_reporting: false
    })
  },

  // ---------- MANUFACTURING ----------
  {
    match: 'ex-partner has been waiting for them in the parking lot',
    response: base({
      jurisdiction: 'Texas',
      guidance: "This is a high-risk stalking pattern that requires immediate safety action. Texas Penal Code § 42.072 defines stalking, and workplace parking-lot stalking is a recognized escalation pattern. As plant manager, activate your workplace violence response: brief plant security with a person-of-concern description, offer escorts to the employee's vehicle at shift-end, and consider adjusting the employee's shift to change predictability. If the employee has a protective order, file a copy with plant security and verify parking lot access controls. Document the disclosure privately. If the ex-partner enters the lot, call 911 and log the incident. Texas employers have broad authority to issue trespass warnings for company property.",
      citations: [
        { statute: 'Tex. Penal Code § 42.072', description: 'Stalking offense' },
        { statute: 'Tex. Code Crim. Proc. Art. 56.81', description: 'Protected leave for victim court attendance' }
      ],
      clarification_questions: [
        'Does the plant have controlled parking lot access?',
        'Has the ex-partner ever entered plant property?',
        'Does the employee have a protective order?'
      ],
      next_steps: [
        'Brief plant security immediately with person-of-concern description',
        'Offer shift-end escorts to the employee\'s vehicle',
        'Review and adjust the employee\'s shift pattern',
        'Issue a trespass warning if legally supported',
        'Document the disclosure and all safety actions taken'
      ],
      sources: [
        { title: 'Texas Attorney General — Stalking Resources', source_url: 'https://www.texasattorneygeneral.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'visible injuries',
    response: base({
      jurisdiction: 'Michigan',
      guidance: "Michigan does not have a DV-specific workplace leave statute, but the Elliott-Larsen Civil Rights Act and Michigan Occupational Safety and Health Act provide some worker protections. When a shift lead observes visible injuries, the appropriate response is NOT to confront or demand disclosure — that can endanger the employee. Instead, create a private, supportive opening: offer EAP information, express care, and let the employee know you're available. Do not document speculation about DV in the personnel file. If injuries pose a safety hazard on the production line (e.g., impaired mobility near equipment), occupational health evaluation may be appropriate. Michigan's Safe at Home program and state DV hotline (1-866-864-2338) are resources to share if the employee engages.",
      citations: [
        { statute: 'MCL § 37.2202', description: 'Elliott-Larsen Civil Rights Act — employment' },
        { statute: 'MCL § 408.1011', description: 'Michigan Occupational Safety and Health Act' }
      ],
      clarification_questions: [
        'Has the employee disclosed anything, or is this suspicion-only?',
        'Do the injuries affect the employee\'s ability to work safely?',
        'Does your facility have an EAP available?'
      ],
      next_steps: [
        'Do not confront or demand disclosure',
        'Create a private, supportive opening with EAP information',
        'Evaluate any safety concerns via occupational health',
        'Share MI DV Hotline (1-866-864-2338) and Safe at Home program',
        'Coach the shift lead on trauma-informed response'
      ],
      sources: [
        { title: 'Michigan Coalition to End DV and Sexual Violence', source_url: 'https://mcedsv.org/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'court hearings related to a protection order',
    response: base({
      jurisdiction: 'Ohio',
      guidance: "Ohio Revised Code § 2930.18 provides time off for victims of crime to attend court proceedings, and Ohio employers generally must accommodate reasonable requests for court appearances related to protective orders. While Ohio does not have a broad DV-leave statute like Illinois VESSA, the combination of ORC § 2930.18 and general reasonable-accommodation principles supports this request. Offer schedule flexibility for the three days per week needed — this may involve shift-swapping, FMLA if applicable (serious health condition), or unpaid leave. Document the accommodation as an interactive-process outcome. Keep the schedule change reason confidential; only note the accommodation itself on the schedule.",
      citations: [
        { statute: 'ORC § 2930.18', description: 'Victim time off for court proceedings' },
        { statute: '29 U.S.C. § 2612 (FMLA)', description: 'Federal medical leave where eligible' }
      ],
      clarification_questions: [
        'How long will the court proceedings continue?',
        'Is the employee eligible for FMLA?',
        'Does the production schedule allow for shift-swaps?'
      ],
      next_steps: [
        'Approve schedule flexibility for court dates under ORC § 2930.18',
        'Explore FMLA if leave is needed beyond court dates',
        'Document the accommodation in a confidential file',
        'Communicate schedule change without disclosing reason',
        'Check in with the employee after court dates conclude'
      ],
      sources: [
        { title: 'Ohio Attorney General — Crime Victim Services', source_url: 'https://www.ohioattorneygeneral.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'legally required to do after an employee discloses',
    response: base({
      jurisdiction: 'California',
      guidance: "California imposes specific duties on employers after a DV disclosure. Cal. Lab. Code § 230 and § 230.1 require you to provide unpaid leave for court appearances, safety planning, and medical care. Cal. Gov. Code § 12945.8 requires reasonable accommodations for DV/sexual assault/stalking victims including schedule changes, transfers, new work phone number, work-area adjustments, and changing locks. You must engage in a timely, good-faith interactive process. You may NOT retaliate, discipline, or discriminate against the employee for disclosing or requesting accommodation. Cal. Lab. Code § 230.1 applies to employers of 25+; smaller employers still owe § 230 protections. Document the interactive process; keep DV disclosures in a separate confidential file.",
      citations: [
        { statute: 'Cal. Lab. Code § 230', description: 'Protected time off for victims' },
        { statute: 'Cal. Lab. Code § 230.1', description: 'Additional protections for employers of 25+' },
        { statute: 'Cal. Gov. Code § 12945.8', description: 'Reasonable accommodations for DV/SA/stalking victims' }
      ],
      clarification_questions: [
        'How many employees does your California location employ?',
        'What specific accommodation is the employee requesting?',
        'Has the employee provided any documentation?'
      ],
      next_steps: [
        'Begin a timely, good-faith interactive process',
        'Offer time off under Cal. Lab. Code § 230/§ 230.1',
        'Evaluate accommodations under Cal. Gov. Code § 12945.8',
        'Document the interactive process in a confidential file',
        'Train the line supervisor on non-retaliation requirements'
      ],
      sources: [
        { title: 'California Civil Rights Department — DV Protections', source_url: 'https://calcivilrights.ca.gov/' }
      ],
      mandatory_reporting: false
    })
  },

  // ---------- HOSPITALITY ----------
  {
    match: 'guest has been making threatening comments',
    response: base({
      jurisdiction: 'Nevada',
      guidance: "Nevada employers in hospitality have obligations under NRS 618 (Nevada OSHA) to provide a safe workplace, including protection from guest-to-worker violence. While Nevada does not have a specific guest-violence statute, the general workplace-safety duty applies. Immediate steps: move the employee away from direct contact with the guest (different shift, different desk, or a colleague covers the guest's interactions). Document verbatim threats where possible. Hotels have broad authority to refuse service under common law — if threats are credible, engage security to issue a no-trespass and consider ending the guest's stay. Nevada NRS 200.591 addresses stalking, which can include repeated threatening behavior. Offer the employee EAP resources.",
      citations: [
        { statute: 'NRS 618', description: 'Nevada Occupational Safety and Health Act' },
        { statute: 'NRS 200.591', description: 'Stalking and aggravated stalking' }
      ],
      clarification_questions: [
        'How long is the guest booked to stay?',
        'Is the guest making threats in person or remotely?',
        'Does hotel security have this guest flagged?'
      ],
      next_steps: [
        'Remove the employee from direct contact with the guest',
        'Document threats verbatim with date and time',
        'Engage hotel security to assess issuing a no-trespass',
        'Consider ending the guest stay if threats are credible',
        'Offer EAP and follow up with the employee'
      ],
      sources: [
        { title: 'Nevada OSHA — Workplace Safety', source_url: 'https://dir.nv.gov/OSHA/' }
      ],
      mandatory_reporting: true
    })
  },
  {
    match: 'rights when it comes to requesting a schedule change',
    response: base({
      jurisdiction: 'Florida',
      guidance: "Florida Statute § 741.313 provides up to three working days of leave in any 12-month period for employees who are DV victims or whose family members are victims. The statute applies to employers of 50+ employees. Schedule change requests tied to safety are generally reasonable accommodations under Florida's general employer obligations and often under company DV policy. Florida does NOT have as robust a scheme as California or New York, but the § 741.313 leave is a protected right. Engage in an interactive conversation about what specific change is needed (shift swap, location change, different entry/exit). Document accommodations. Do not require the employee to disclose specific details of the safety issue beyond what is necessary.",
      citations: [
        { statute: 'Fla. Stat. § 741.313', description: 'DV leave for employees' },
        { statute: 'Fla. Stat. § 784.046', description: 'Protection orders for repeat violence' }
      ],
      clarification_questions: [
        'How many employees does your Florida property have?',
        'What specific schedule change is the employee requesting?',
        'Is this a temporary or ongoing accommodation?'
      ],
      next_steps: [
        'Confirm § 741.313 applicability based on headcount',
        'Engage in an interactive conversation on the specific change needed',
        'Offer shift swap or schedule change where operationally feasible',
        'Document the accommodation confidentially',
        'Provide FL DV Hotline (1-800-500-1119) as a resource'
      ],
      sources: [
        { title: 'Florida Department of Children and Families — DV', source_url: 'https://www.myflfamilies.com/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'harassed by a co-worker and they\'re afraid to come in',
    response: base({
      jurisdiction: 'California',
      guidance: "This disclosure creates immediate duties for you and for the employer under California's Fair Employment and Housing Act (Cal. Gov. Code § 12940) and SB 553 (Cal. Lab. Code § 6401.9). You must take prompt and effective action — inaction is itself a violation. Separate the two employees on the schedule immediately while the investigation is underway. The reporting employee must NOT be the one transferred or scheduled away unless they request it. Preserve any evidence (messages, witnesses). Open a formal harassment investigation via HR. The employee also may be entitled to paid sick leave and — if the harassment rises to stalking or assault — accommodations under Cal. Gov. Code § 12945.8. Reassure the employee that retaliation is prohibited.",
      citations: [
        { statute: 'Cal. Gov. Code § 12940', description: 'FEHA — harassment & retaliation prohibitions' },
        { statute: 'Cal. Lab. Code § 6401.9', description: 'Workplace Violence Prevention Plan (SB 553)' },
        { statute: 'Cal. Gov. Code § 12945.8', description: 'Accommodations for DV/SA/stalking victims' }
      ],
      clarification_questions: [
        'Has the employee provided any documentation of the harassment?',
        'Are both employees currently scheduled together?',
        'Has HR been notified yet?'
      ],
      next_steps: [
        'Separate the two employees on the schedule immediately',
        'Open a formal harassment investigation via HR',
        'Preserve evidence and interview witnesses',
        'Issue a no-retaliation reminder',
        'Offer accommodations under § 12945.8 if applicable'
      ],
      sources: [
        { title: 'California Civil Rights Department — Harassment', source_url: 'https://calcivilrights.ca.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'keep it quiet',
    response: base({
      jurisdiction: 'New York',
      guidance: "Respecting the employee's confidentiality preference is the legally and ethically correct starting point. Under N.Y. Exec. Law § 296(22), DV disclosures are confidential, and you may only share with HR or others on a need-to-know basis for accommodation purposes. Do NOT share the employee's name, situation, or details with peers, family, or other managers. You MAY need to involve HR if the employee requests accommodations or paid safe leave under N.Y. Labor Law § 196-b. In that case, share only what's necessary to implement the accommodation. Document the disclosure in a confidential file — separate from personnel records. Inform the employee about what you can and cannot keep confidential (e.g., if credible threats against others arise, that changes the calculus).",
      citations: [
        { statute: 'N.Y. Exec. Law § 296(22)', description: 'DV accommodations & confidentiality' },
        { statute: 'N.Y. Labor Law § 196-b', description: 'Paid safe leave for DV victims' }
      ],
      clarification_questions: [
        'Is the employee requesting any accommodation that requires HR involvement?',
        'Are there credible threats to other employees?',
        'Would the employee consent to a confidential HR conversation?'
      ],
      next_steps: [
        'Respect the employee\'s confidentiality preference by default',
        'Document in a separate confidential file — not personnel record',
        'Clarify with the employee what confidentiality can and cannot cover',
        'Loop HR in only on a need-to-know basis for accommodations',
        'Provide NY OPDV resources (opdv.ny.gov)'
      ],
      sources: [
        { title: 'NY Office for the Prevention of DV', source_url: 'https://opdv.ny.gov/' }
      ],
      mandatory_reporting: false
    })
  },

  // ---------- CORPORATE ----------
  {
    match: 'travel nurse on a 13-week assignment in Texas was grabbed',
    response: base({
      jurisdiction: 'Texas',
      guidance: "As the staffing employer, you have OSHA General Duty Clause obligations (29 U.S.C. § 654) to provide a safe workplace for your placed workers, even though they are at a client site. Texas does not have a specific healthcare workplace-violence standard like California, but federal OSHA guidance on healthcare workplace violence (OSHA 3148) applies. You have a duty to investigate, document the incident, and engage the client hospital about their incident-reporting failure. This is a contractual issue as well — most staffing agreements require client facilities to notify the agency of incidents involving placed staff. Escalate to your legal team and to the hospital's risk management. Offer the nurse immediate support: EAP, medical evaluation, option to transfer assignment. Document the event as an OSHA-recordable incident for your own logs.",
      citations: [
        { statute: '29 U.S.C. § 654 (OSH Act General Duty Clause)', description: 'Employer duty to provide safe workplace' },
        { statute: 'OSHA Publication 3148', description: 'Healthcare Workplace Violence Guidelines' },
        { statute: 'Tex. Penal Code § 22.01', description: 'Assault (patient-on-worker)' }
      ],
      clarification_questions: [
        'Has the nurse received a medical evaluation post-incident?',
        'Does your staffing contract require facility incident reporting?',
        'Has the nurse requested reassignment or contract break?'
      ],
      next_steps: [
        'Document the incident in your agency OSHA log',
        'Escalate the hospital\'s reporting failure to their risk management',
        'Offer the nurse medical evaluation, EAP, and reassignment',
        'Engage legal on the contract breach question',
        'Brief the recruiter on duty-of-care communication with the nurse'
      ],
      sources: [
        { title: 'OSHA 3148 — Workplace Violence Prevention for Healthcare', source_url: 'https://www.osha.gov/Publications/osha3148.pdf' }
      ],
      mandatory_reporting: true
    })
  },
  {
    match: 'EMP-2847',
    response: base({
      jurisdiction: 'California',
      guidance: "For this escalated case, engage the full California interactive-process framework. The employee has asserted specific needs (schedule accommodation, court date) triggering Cal. Lab. Code § 230, § 230.1, and Cal. Gov. Code § 12945.8. HR's next steps: (1) Confirm the store manager has implemented a temporary schedule change pending HR review; (2) Open a formal accommodation case file tagged to EMP-2847; (3) Confirm court-date leave under § 230(c) — unpaid, protected; (4) Evaluate whether a location transfer, new work phone, or entry/exit changes are warranted; (5) Document the interactive-process steps and outcomes. Because the disclosure has already been escalated to corporate, confirm the chain: Employee → Store Manager → HR. Verify no retaliation occurred at the store-manager level.",
      citations: [
        { statute: 'Cal. Lab. Code § 230(c)', description: 'Court-proceeding leave for DV victims' },
        { statute: 'Cal. Lab. Code § 230.1', description: 'Additional protections for 25+ employers' },
        { statute: 'Cal. Gov. Code § 12945.8', description: 'Reasonable accommodations for DV/SA/stalking' }
      ],
      clarification_questions: [
        'Has the store manager implemented a temporary schedule change?',
        'Is there any indication of retaliation at the store level?',
        'What specific accommodations has the employee requested?'
      ],
      next_steps: [
        'Open formal accommodation case file tagged to EMP-2847',
        'Confirm § 230(c) court leave is protected and unpaid',
        'Evaluate additional § 12945.8 accommodations',
        'Audit store-manager actions for retaliation risk',
        'Document the full interactive-process timeline'
      ],
      sources: [
        { title: 'California Civil Rights Department — DV Accommodations', source_url: 'https://calcivilrights.ca.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'break her contract after a violent incident',
    response: base({
      jurisdiction: 'Illinois',
      guidance: "Illinois VESSA (820 ILCS 180) is directly applicable here. The placed nurse, as your W-2 employee, is entitled to up to 12 weeks of VESSA leave and reasonable accommodations — which, depending on circumstances, can include early contract termination without liquidated damages. Before processing a contract break: (1) Document the violent incident per OSHA General Duty Clause obligations; (2) Verify the employee has been offered VESSA leave as an alternative to contract break; (3) Review the contract's force-majeure and safety-termination clauses; (4) Engage legal on liquidated-damages enforceability — Illinois courts have disfavored enforcing liquidated damages against DV/stalking victims. Documentation requirements: incident report, employee written request, any protective-order copies, medical documentation if provided (not required), and the client-facility incident report.",
      citations: [
        { statute: '820 ILCS 180', description: "Victims' Economic Security and Safety Act (VESSA)" },
        { statute: '29 U.S.C. § 654', description: 'OSHA General Duty Clause' }
      ],
      clarification_questions: [
        'Has the nurse been offered VESSA leave as an alternative?',
        'Does your contract have a safety-termination clause?',
        'Has the client facility filed an incident report?'
      ],
      next_steps: [
        'Document the violent incident per OSHA obligations',
        'Offer VESSA leave before processing contract break',
        'Engage legal on liquidated-damages question',
        'Collect client facility incident report',
        'Process contract break with documented safety rationale'
      ],
      sources: [
        { title: 'Illinois DOL — VESSA', source_url: 'https://labor.illinois.gov/' }
      ],
      mandatory_reporting: false
    })
  },
  {
    match: 'hospital client in New York isn\'t following incident reporting',
    response: base({
      jurisdiction: 'New York',
      guidance: "New York Labor Law § 27-b requires public-sector healthcare employers to have workplace violence prevention programs, and NY Public Health Law § 2805-g requires hospitals to report certain adverse events. More directly relevant here: your staffing agency has OSHA General Duty Clause obligations for placed workers. When a client facility fails to follow its own incident-reporting procedures, your obligations are (1) Document what you know of the incident independently; (2) Escalate to the hospital's risk management and compliance officer in writing; (3) Review your staffing contract's safety and incident-reporting requirements; (4) Consider whether the contract breach justifies suspending further placements until corrective action; (5) Engage your legal team on regulatory reporting — depending on severity, complaints to NY DOH or OSHA may be warranted.",
      citations: [
        { statute: 'NY Lab. Law § 27-b', description: 'Workplace violence prevention (public healthcare)' },
        { statute: 'NY Pub. Health Law § 2805-g', description: 'Hospital adverse event reporting' },
        { statute: '29 U.S.C. § 654', description: 'OSHA General Duty Clause' }
      ],
      clarification_questions: [
        'Has the hospital been notified in writing of the reporting failure?',
        'Are additional placed providers at risk at this facility?',
        'Does the regional director have documentation of the pattern?'
      ],
      next_steps: [
        'Document the incident and reporting failure in writing',
        'Escalate to hospital risk management and compliance',
        'Review contract safety and incident-reporting terms',
        'Consider suspending new placements pending corrective action',
        'Engage legal on potential NY DOH or OSHA complaints'
      ],
      sources: [
        { title: 'NY DOH — Hospital Incident Reporting', source_url: 'https://www.health.ny.gov/' }
      ],
      mandatory_reporting: true
    })
  }
];

/**
 * findMockResponse accepts the user's free text, plus (optionally) structured
 * state/industry hints from the deployment context. When the text matches a
 * scenario, that scenario response is returned. When it doesn't, we still try
 * to produce a state-aware response by templating from another scenario in
 * the same state, so the downstream jurisdiction and next_steps remain
 * relevant rather than falling through to "General Guidance".
 */
export function findMockResponse(userInput, { state, industry } = {}) {
  const input = (userInput || '').toLowerCase();
  for (const entry of MOCK_RESPONSES) {
    if (input.includes(entry.match.toLowerCase())) {
      return { ...entry.response, search_latency: 0.9 + Math.random() * 0.9 };
    }
  }

  // State-aware fallback: pick a mock from the same state if one exists.
  if (state) {
    const stateMatch = MOCK_RESPONSES.find(
      e => (e.response.jurisdiction || '').toLowerCase() === String(state).toLowerCase()
    );
    if (stateMatch) {
      return {
        ...stateMatch.response,
        // Replace the narrative with a more generic state-aware version so
        // we don't repeat the specific scenario language verbatim, but keep
        // the state-accurate citations and next_steps scaffolding.
        guidance: buildStateAwareGuidance(state, industry),
        clarification_questions: [
          'Is the employee requesting a specific accommodation?',
          `Does the employee want to involve ${state} law enforcement?`,
          'Has the employee provided a protection order or incident report?'
        ],
        search_latency: 0.9 + Math.random() * 0.9
      };
    }
  }

  // Last resort: a general fallback, but if we know a state, use it.
  return base({
    jurisdiction: state || 'General Guidance',
    guidance: buildStateAwareGuidance(state, industry),
    citations: [
      { statute: 'OSHA General Duty Clause', description: 'Employer duty to provide a safe workplace' }
    ],
    clarification_questions: [
      state ? `Which specific ${state} statute should we cite?` : 'What state is the workplace in?',
      'Is the employee requesting a specific accommodation?',
      'Is there any indication of imminent threat?'
    ],
    next_steps: [
      'Document the disclosure privately (date, time, factual summary)',
      'Offer a confidential private conversation away from the floor',
      'Share EAP and DV hotline resources (1-800-799-7233)',
      state
        ? `Confirm any ${state}-specific protected leave and accommodation entitlements`
        : 'Coordinate with HR only on a need-to-know basis',
      'Schedule a follow-up check-in within one week'
    ],
    sources: [
      { title: 'OSHA Workplace Violence Resources', source_url: 'https://www.osha.gov/workplace-violence' },
      { title: 'National Domestic Violence Hotline', source_url: 'https://www.thehotline.org/' }
    ],
    mandatory_reporting: false
  });
}

function buildStateAwareGuidance(state, industry) {
  const stateLabel = state || 'your state';
  const industryLabel = industry || 'workplace';
  return `Thank you for bringing this forward. Based on the information you've shared and the ${industryLabel} context in ${stateLabel}, here are the immediate priorities. First, ensure the employee's physical safety — if there is any imminent threat, contact law enforcement and your security team now. Second, document the disclosure privately, capturing date, time, location, and a factual summary (no speculation). Third, offer reasonable accommodations such as a schedule change, a new work phone or workstation, or protected leave — ${stateLabel} statute may require an interactive-process conversation. Fourth, loop in HR only on a need-to-know basis and keep the disclosure in a confidential file separate from the personnel record. Finally, share resources including your EAP and the National Domestic Violence Hotline (1-800-799-7233). If a protection order is in place, request a copy for security. If the employee declines any specific accommodation, document the offer and the decline. ${stateLabel}-specific protected-leave rules and accommodation obligations apply — review them with HR or legal before closing the matter.`;
}
