import OpenAI from 'openai';

// Comprehensive Category Knowledge Base & Heuristic Rules
const CATEGORY_RULES = [
  {
    category: 'Electrician',
    keywords: [
      'electric', 'spark', 'sparking', 'short circuit', 'fuse', 'mcb', 'tripping', 'switch',
      'switchboard', 'wire', 'wiring', 'shock', 'power cut', 'no power', 'socket', 'light',
      'fan', 'chandelier', 'inverter', 'voltage', 'burning smell'
    ],
    urgencyKeywords: {
      high: ['spark', 'sparking', 'shock', 'burning smell', 'smoke', 'short circuit', 'tripping constantly', 'blast'],
      medium: ['no power in room', 'socket dead', 'switch loose', 'fan making noise'],
      low: ['install new lamp', 'fit bulb', 'replace cover']
    },
    defaultPrice: { min: 300, max: 800 },
    skills: ['Wiring', 'Circuit Breaker', 'Fault Finding', 'Appliance Installation']
  },
  {
    category: 'Plumber',
    keywords: [
      'plumb', 'pipe', 'leak', 'leaking', 'water', 'burst', 'tap', 'faucet', 'drain', 'clog',
      'clogged', 'sink', 'toilet', 'flush', 'geyser', 'overflow', 'shower', 'sewage',
      'pipeline', 'low pressure', 'motor'
    ],
    urgencyKeywords: {
      high: ['burst', 'flooding', 'overflowing', 'major leak', 'sewage backup', 'water gushing'],
      medium: ['dripping tap', 'slow drain', 'flush not working', 'low pressure'],
      low: ['tap replacement', 'aerator cleaning', 'fitting installation']
    },
    defaultPrice: { min: 350, max: 950 },
    skills: ['Pipe Fitting', 'Leak Repair', 'Drainage Unclogging', 'Sanitary Ware']
  },
  {
    category: 'Air Conditioner',
    keywords: [
      'ac', 'air conditioner', 'cooling', 'not cooling', 'compressor', 'gas refill', 'freon',
      'water dripping from ac', 'ac noise', 'split ac', 'window ac', 'filter', 'remote',
      'servicing', 'coil'
    ],
    urgencyKeywords: {
      high: ['water leaking inside bedroom', 'burning smell from ac', 'compressor making loud bang'],
      medium: ['not cooling properly', 'foul odor', 'ice formation'],
      low: ['annual servicing', 'routine cleaning', 'filter wash', 'uninstallation']
    },
    defaultPrice: { min: 499, max: 1800 },
    skills: ['Gas Charging', 'Coil Cleaning', 'Compressor Repair', 'PCB Diagnostics']
  },
  {
    category: 'Appliance Technician',
    keywords: [
      'washing machine', 'refrigerator', 'fridge', 'microwave', 'oven', 'dishwasher',
      'ro water purifier', 'geyser', 'water heater', 'chimney', 'mixer', 'grinder', 'dryer'
    ],
    urgencyKeywords: {
      high: ['fridge not cooling spoiling food', 'washing machine leaking water all over', 'geyser shocking'],
      medium: ['drum not spinning', 'water not heating', 'chimney suction low'],
      low: ['filter change', 'deep clean', 'routine checkup']
    },
    defaultPrice: { min: 399, max: 1200 },
    skills: ['Appliance Diagnostics', 'Motor Replacement', 'Filter Renewal', 'Thermostat Fix']
  },
  {
    category: 'Carpenter',
    keywords: [
      'carpenter', 'wood', 'door', 'lock', 'handle', 'hinge', 'cabinet', 'wardrobe', 'bed',
      'furniture', 'table', 'chair', 'drawer', 'shelf', 'drilling', 'curtain rod'
    ],
    urgencyKeywords: {
      high: ['door lock jammed', 'locked inside', 'broken main latch'],
      medium: ['door scraping floor', 'drawer stuck', 'hinge broken'],
      low: ['furniture assembly', 'shelf installation', 'curtain rod hanging']
    },
    defaultPrice: { min: 300, max: 850 },
    skills: ['Locksmith', 'Furniture Assembly', 'Door Fitting', 'Wood Restoration']
  },
  {
    category: 'Home Cleaning',
    keywords: [
      'clean', 'cleaning', 'deep clean', 'sanitize', 'bathroom clean', 'kitchen clean',
      'sofa cleaning', 'carpet', 'dusting', 'mop', 'stain'
    ],
    urgencyKeywords: {
      high: ['post flood cleanup', 'sewage spill cleaning'],
      medium: ['move out cleaning', 'festival deep clean'],
      low: ['regular room cleaning', 'sofa shampooing']
    },
    defaultPrice: { min: 699, max: 2499 },
    skills: ['Deep Sanitation', 'Pressure Wash', 'Sofa Upholstery', 'Floor Buffing']
  },
  {
    category: 'Pest Control',
    keywords: [
      'pest', 'cockroach', 'termite', 'bedbug', 'bed bug', 'rat', 'rodent', 'ant', 'mosquito',
      'insect', 'spray', 'fumigation'
    ],
    urgencyKeywords: {
      high: ['heavy termite infestation', 'bedbug outbreak preventing sleep'],
      medium: ['cockroaches in kitchen', 'rodents visible'],
      low: ['preventive seasonal spray']
    },
    defaultPrice: { min: 899, max: 2200 },
    skills: ['Termite Treatment', 'Bedbug Eradication', 'Gel Baiting', 'Herbal Spray']
  },
  {
    category: 'Painter',
    keywords: [
      'paint', 'painting', 'wall', 'primer', 'distemper', 'texture', 'waterproofing', 'dampness',
      'seepage', 'touchup'
    ],
    urgencyKeywords: {
      high: ['active water seepage peeling ceiling'],
      medium: ['damp patches', 'room repainting'],
      low: ['accent wall design', 'small touchups']
    },
    defaultPrice: { min: 1200, max: 5000 },
    skills: ['Waterproofing', 'Emulsion Painting', 'Wall Putty', 'Texture Art']
  }
];

/**
 * Deterministic Rule-Based Classifier (Mandatory Fallback)
 */
export const classifyIssueWithRules = (text) => {
  const lower = text.toLowerCase();

  let matchedCategory = CATEGORY_RULES[0];
  let maxKeywordMatches = -1;

  for (const rule of CATEGORY_RULES) {
    let matches = 0;
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) matches++;
    }
    if (matches > maxKeywordMatches) {
      maxKeywordMatches = matches;
      matchedCategory = rule;
    }
  }

  // Determine urgency level (1 - 5)
  let urgencyLevel = 2; // Default moderate
  let urgencyReason = 'Standard service request';
  let isEmergency = false;

  // Check High Urgency
  if (matchedCategory.urgencyKeywords.high.some(kw => lower.includes(kw))) {
    urgencyLevel = 5;
    isEmergency = true;
    urgencyReason = 'Detected hazardous or rapidly deteriorating condition requiring immediate response';
  } else if (matchedCategory.urgencyKeywords.medium.some(kw => lower.includes(kw))) {
    urgencyLevel = 3;
    urgencyReason = 'Requires scheduled professional attention to prevent further breakdown';
  } else if (matchedCategory.urgencyKeywords.low.some(kw => lower.includes(kw))) {
    urgencyLevel = 1;
    urgencyReason = 'Routine maintenance or scheduled aesthetic enhancement';
  }

  // Recommended safety guidance
  let recommendedAction = 'Keep the area clear and avoid touching exposed components.';
  if (matchedCategory.category === 'Electrician' && isEmergency) {
    recommendedAction = '⚠️ Turn off main MCB power switch immediately until the technician arrives.';
  } else if (matchedCategory.category === 'Plumber' && isEmergency) {
    recommendedAction = '⚠️ Shut off the main inlet water valve to prevent flood damage.';
  } else if (matchedCategory.category === 'Air Conditioner') {
    recommendedAction = 'Turn off the AC unit to prevent compressor coil burnout.';
  }

  return {
    category: matchedCategory.category,
    subCategory: `${matchedCategory.category} Diagnostic & Resolution`,
    urgencyLevel,
    isEmergency,
    urgencyReason,
    estimatedCost: matchedCategory.defaultPrice,
    suggestedSkills: matchedCategory.skills,
    recommendedAction,
    classifiedBy: 'rules',
    confidenceScore: maxKeywordMatches > 0 ? Math.min(0.95, 0.65 + maxKeywordMatches * 0.1) : 0.60
  };
};

/**
 * Main Classifier with OpenAI LLM + Deterministic Fallback
 */
export const classifyIssue = async (userInputText) => {
  if (!userInputText || typeof userInputText !== 'string' || userInputText.trim() === '') {
    return classifyIssueWithRules('general repair');
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith('sk-') && !apiKey.includes('placeholder')) {
    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `Analyze this user's local service problem description: "${userInputText}".
Respond ONLY with a valid JSON object matching this structure:
{
  "category": "Electrician" | "Plumber" | "Air Conditioner" | "Appliance Technician" | "Carpenter" | "Home Cleaning" | "Pest Control" | "Painter",
  "subCategory": "string describing specific issue",
  "urgencyLevel": number from 1 (lowest) to 5 (critical emergency),
  "isEmergency": boolean,
  "urgencyReason": "string explanation",
  "estimatedCost": { "min": number, "max": number },
  "suggestedSkills": ["skill1", "skill2"],
  "recommendedAction": "safety or preparation tip for user"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 400
      });

      const parsed = JSON.parse(completion.choices[0].message.content);
      return {
        ...parsed,
        classifiedBy: 'llm',
        confidenceScore: 0.96
      };
    } catch (llmError) {
      console.warn('⚠️ OpenAI API call failed or rate-limited. Activating mandatory deterministic rule-based fallback:', llmError.message);
      return classifyIssueWithRules(userInputText);
    }
  }

  // Deterministic rule-based fallback
  return classifyIssueWithRules(userInputText);
};
