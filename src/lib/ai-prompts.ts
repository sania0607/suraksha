// Disaster-specific prompts and templates for Suraksha AI Assistant

export const DISASTER_PROMPTS = {
  // Emergency Response Prompts
  EARTHQUAKE: {
    title: "Earthquake Response",
    prompt: "What should I do during an earthquake? Please provide step-by-step instructions for both indoor and outdoor scenarios.",
    category: "Emergency Response"
  },
  
  FIRE_EMERGENCY: {
    title: "Fire Safety",
    prompt: "How should I respond to a fire emergency in a school building? Include evacuation procedures and safety protocols.",
    category: "Emergency Response"
  },
  
  TORNADO: {
    title: "Tornado Safety",
    prompt: "What are the proper tornado safety procedures for schools? Where should students take shelter?",
    category: "Emergency Response"
  },
  
  FLOOD: {
    title: "Flood Response",
    prompt: "How should schools respond to flood warnings and flooding? What are the evacuation procedures?",
    category: "Emergency Response"
  },
  
  // Preparedness Prompts
  EMERGENCY_KIT: {
    title: "Emergency Kit",
    prompt: "What items should be included in a school emergency kit? Please provide a comprehensive list for different types of disasters.",
    category: "Preparedness"
  },
  
  EVACUATION_PLAN: {
    title: "Evacuation Planning",
    prompt: "How do I create an effective evacuation plan for my school? What elements should be included?",
    category: "Preparedness"
  },
  
  COMMUNICATION_PLAN: {
    title: "Emergency Communication",
    prompt: "How should schools communicate during emergencies? What systems and protocols are most effective?",
    category: "Preparedness"
  },
  
  // Training Prompts
  DRILL_PROCEDURES: {
    title: "Emergency Drills",
    prompt: "How often should schools conduct emergency drills? What types of drills are most important?",
    category: "Training"
  },
  
  FIRST_AID: {
    title: "First Aid Basics",
    prompt: "What are the essential first aid skills that school staff should know for emergency situations?",
    category: "Training"
  },
  
  // Special Situations
  LOCKDOWN: {
    title: "Security Lockdown",
    prompt: "What are the procedures for a security lockdown in schools? How should students and staff respond?",
    category: "Security"
  },
  
  CHEMICAL_SPILL: {
    title: "Chemical Safety",
    prompt: "How should schools respond to chemical spills or hazardous material incidents?",
    category: "Safety"
  },
  
  POWER_OUTAGE: {
    title: "Power Outage",
    prompt: "What procedures should schools follow during extended power outages or utility failures?",
    category: "Infrastructure"
  }
};

export const QUICK_ACTIONS = [
  {
    icon: "🚨",
    title: "Emergency Response",
    description: "Immediate action steps for active emergencies",
    prompts: [
      DISASTER_PROMPTS.EARTHQUAKE,
      DISASTER_PROMPTS.FIRE_EMERGENCY,
      DISASTER_PROMPTS.TORNADO,
      DISASTER_PROMPTS.FLOOD
    ]
  },
  {
    icon: "📋",
    title: "Preparedness Planning",
    description: "Long-term planning and preparation guidance",
    prompts: [
      DISASTER_PROMPTS.EMERGENCY_KIT,
      DISASTER_PROMPTS.EVACUATION_PLAN,
      DISASTER_PROMPTS.COMMUNICATION_PLAN
    ]
  },
  {
    icon: "🎓",
    title: "Training & Drills",
    description: "Educational resources and practice procedures",
    prompts: [
      DISASTER_PROMPTS.DRILL_PROCEDURES,
      DISASTER_PROMPTS.FIRST_AID
    ]
  },
  {
    icon: "🔒",
    title: "Security & Safety",
    description: "Security protocols and safety procedures",
    prompts: [
      DISASTER_PROMPTS.LOCKDOWN,
      DISASTER_PROMPTS.CHEMICAL_SPILL,
      DISASTER_PROMPTS.POWER_OUTAGE
    ]
  }
];

export const SYSTEM_PROMPTS = {
  INITIAL_CONTEXT: `
You are Suraksha AI, an expert disaster preparedness and emergency response assistant specifically designed for educational institutions. You help students, teachers, administrators, and staff prepare for and respond to various disasters and emergencies.

Your primary expertise covers:

🔥 FIRE SAFETY & EVACUATION
- Fire prevention and detection
- Evacuation procedures and routes
- Fire extinguisher usage
- Smoke inhalation safety

🌍 EARTHQUAKE RESPONSE
- Drop, Cover, and Hold On procedures
- Safe zones identification
- Post-earthquake assessment
- Building safety evaluation

🌪️ SEVERE WEATHER
- Tornado and hurricane safety
- Severe storm protocols
- Lightning safety
- Wind damage response

🌊 FLOOD EMERGENCIES
- Flood warning systems
- Water safety procedures
- Evacuation protocols
- Recovery procedures

⚡ ELECTRICAL & CHEMICAL SAFETY
- Electrical hazard response
- Chemical spill procedures
- Hazardous material handling
- Utility emergency protocols

🏥 MEDICAL EMERGENCIES
- Basic first aid procedures
- Medical emergency response
- Student health emergencies
- Mental health crisis support

🔒 SECURITY PROTOCOLS
- Lockdown procedures
- Threat assessment
- Campus security measures
- Emergency communication

IMPORTANT GUIDELINES:
1. Always prioritize calling emergency services (911) in life-threatening situations
2. Provide clear, step-by-step instructions
3. Consider age-appropriate guidance for different student groups
4. Emphasize safety-first approaches
5. Include both immediate response and recovery information
6. Reference official emergency protocols when possible
7. Provide practical, actionable advice

Remember: You are providing educational guidance to help with preparedness and training. In actual emergencies, always emphasize the importance of following established school emergency protocols and contacting emergency services immediately.
`,

  EMERGENCY_DISCLAIMER: `
⚠️ EMERGENCY DISCLAIMER: 
If this is a real emergency, please contact emergency services immediately:
- Call 911 for immediate emergencies
- Follow your school's established emergency protocols
- Ensure your safety before helping others

This AI assistant provides educational guidance and should supplement, not replace, official emergency procedures and training.
`
};

export const CONVERSATION_STARTERS = [
  "What should I do during an earthquake?",
  "How do I create an evacuation plan for my school?",
  "What should be in an emergency kit?",
  "How do we communicate during emergencies?",
  "What are the steps for a fire evacuation?",
  "How often should we practice emergency drills?",
  "What is the proper tornado safety procedure?",
  "How do I assess if a building is safe after an earthquake?",
  "What are the signs of a gas leak?",
  "How should we respond to a lockdown situation?"
];

export default {
  DISASTER_PROMPTS,
  QUICK_ACTIONS,
  SYSTEM_PROMPTS,
  CONVERSATION_STARTERS
};