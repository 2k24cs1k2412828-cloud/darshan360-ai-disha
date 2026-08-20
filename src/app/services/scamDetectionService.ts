// Scam Detection Service
// Detects potential scam patterns in user messages and provides safety alerts

import { detectPotentialScams, getSafetyAdvisory, getAllScams, getEmergencyNumbers } from './madhyaPradeshService';

interface ScamAlert {
  type: string;
  severity: 'high' | 'medium' | 'low';
  warning_message: string;
  prevention_tips: string[];
  emergency_number: string;
}

// Keywords that indicate potential scam situations
const scamPatterns: Record<string, { keywords: RegExp; severity: 'high' | 'medium' | 'low'; type: string }> = {
  overcharging: {
    keywords: /\b(overcharge|overpriced|expensive|too much|double price|triple|scam|cheat)\b/gi,
    severity: 'high',
    type: 'potential_overcharging'
  },
  unsolicited_offer: {
    keywords: /\b(offer|deal|cheap|discount|half price|bargain|special rate|agent|guide)\b/gi,
    severity: 'medium',
    type: 'unsolicited_offer'
  },
  forced_purchase: {
    keywords: /\b(forced|must buy|compulsory|have to|required|demanded|payment required)\b/gi,
    severity: 'high',
    type: 'forced_purchase'
  },
  donation_pressure: {
    keywords: /\b(donation|charity|fund|collection|compulsory donation|must donate)\b/gi,
    severity: 'high',
    type: 'donation_pressure'
  },
  credential_doubt: {
    keywords: /\b(no ID|without license|fake|unauthorized|unofficial|not registered)\b/gi,
    severity: 'medium',
    type: 'credential_doubt'
  },
  payment_demands: {
    keywords: /\b(pay now|upfront|advance payment|cash only|no receipt)\b/gi,
    severity: 'high',
    type: 'payment_demands'
  },
  threat_or_pressure: {
    keywords: /\b(threatened|pressure|force|threatened|intimidated|coerced)\b/gi,
    severity: 'high',
    type: 'threat_or_pressure'
  }
};

export function detectScamsInMessage(message: string): ScamAlert[] {
  const alerts: ScamAlert[] = [];
  const messageLower = message.toLowerCase();

  // Check against pattern-based detection
  Object.entries(scamPatterns).forEach(([patternName, patternData]) => {
    if (patternData.keywords.test(message)) {
      const alert = getScamAlertForPattern(patternName, patternData.severity, patternData.type);
      if (alert) alerts.push(alert);
    }
  });

  // Check against known scams from database
  const dbScams = detectPotentialScams(message);
  dbScams.forEach(scam => {
    const alert = convertScamToAlert(scam);
    if (alert) alerts.push(alert);
  });

  // Remove duplicate alerts based on type
  const uniqueAlerts = alerts.reduce((acc: ScamAlert[], current) => {
    const isDuplicate = acc.some(alert => alert.type === current.type);
    if (!isDuplicate) acc.push(current);
    return acc;
  }, []);

  return uniqueAlerts;
}

function getScamAlertForPattern(
  patternName: string,
  severity: 'high' | 'medium' | 'low',
  type: string
): ScamAlert | null {
  const emergencyNumbers = getEmergencyNumbers();

  const alertTemplates: Record<string, Omit<ScamAlert, 'type'>> = {
    overcharging: {
      severity: 'high',
      warning_message:
        '⚠️ **Warning: Potential Overcharging Detected**\n\nBased on your message, you may be experiencing overcharging. Always negotiate prices BEFORE engaging services.',
      prevention_tips: [
        'Always ask for the price upfront BEFORE boarding boats, autos, or hiring services',
        'Standard rates: Sunrise boat ₹100-150, Autos ₹50-150 (negotiate), Hotels ₹300-3000',
        'Use Uber/Ola for transparent pricing on rides',
        'Never pay until you confirm exact cost and duration'
      ],
      emergency_number: emergencyNumbers['tourist_police'] || '0542-2200441'
    },
    unsolicited_offer: {
      severity: 'medium',
      warning_message:
        '⚠️ **Caution: Unsolicited Offer Detected**\n\nUnauthorized agents often approach tourists with incredible deals. Be cautious.',
      prevention_tips: [
        'Do not accept offers from strangers on the street',
        'Book hotels through official websites or trusted OTAs',
        'Hire guides through your hotel or tourist office',
        'Verify any arrangement through official channels'
      ],
      emergency_number: emergencyNumbers['tourist_police'] || '0542-2200441'
    },
    forced_purchase: {
      severity: 'high',
      warning_message:
        '🚨 **Alert: Forced Purchase Attempt Detected**\n\nNo purchase or service is ever compulsory. You have the right to refuse.',
      prevention_tips: [
        'Remember: You are not obligated to buy anything',
        'If pressured, calmly walk away or find a shopkeeper to help',
        'Report pressure tactics to tourist police immediately',
        'All temples and services should be voluntary'
      ],
      emergency_number: emergencyNumbers['tourist_police'] || '0542-2200441'
    },
    donation_pressure: {
      severity: 'high',
      warning_message:
        '🚨 **Critical Alert: Donation Pressure Detected**\n\nDonations to temples are ALWAYS voluntary. No one can force you to donate.',
      prevention_tips: [
        'ALL donations in temples are 100% voluntary',
        'Donate only at official temple collection counters',
        'Request receipt for any donation',
        'Priests cannot demand payments for "blessings" or rituals'
      ],
      emergency_number: emergencyNumbers['tourist_police'] || '0542-2200441'
    },
    credential_doubt: {
      severity: 'medium',
      warning_message:
        '⚠️ **Caution: Credential Verification Issue**\n\nVerify that anyone offering services has proper credentials.',
      prevention_tips: [
        'Always ask for official ID from guides and service providers',
        'Verify license number with tourism office',
        'Book through official channels with registered providers',
        'Check if name is in official guide registry'
      ],
      emergency_number: emergencyNumbers['tourism_helpline'] || '0542-2206164'
    },
    payment_demands: {
      severity: 'high',
      warning_message:
        '🚨 **Alert: Suspicious Payment Demand Detected**\n\nBe cautious about upfront payment demands. Always get receipts.',
      prevention_tips: [
        'Never pay full amount upfront (except established hotels/trains)',
        'Pay in stages: Some deposit, final payment on completion',
        'Always get official receipt for any payment',
        'Keep receipt for dispute resolution if needed'
      ],
      emergency_number: emergencyNumbers['tourist_police'] || '0542-2200441'
    },
    threat_or_pressure: {
      severity: 'high',
      warning_message:
        '🚨 **URGENT: Threat Detected**\n\nIf you are being threatened or coerced, this is a serious crime. Contact police immediately.',
      prevention_tips: [
        'Move to a crowded area or shop immediately',
        'Do not give in to threats',
        'Contact police right away',
        'Get help from shopkeepers or nearby people',
        'Save their appearance/details for police report'
      ],
      emergency_number: emergencyNumbers['general_police'] || '100'
    }
  };

  const template = alertTemplates[patternName];
  if (template) {
    return { ...template, type };
  }

  return null;
}

function convertScamToAlert(scam: any): ScamAlert {
  const emergencyNumbers = getEmergencyNumbers();
  return {
    type: scam.id,
    severity: scam.id.includes('threat') || scam.id.includes('forced') ? 'high' : 'medium',
    warning_message: `⚠️ **Warning: ${scam.type}**\n\n${scam.description}`,
    prevention_tips: scam.what_to_do,
    emergency_number: scam.emergency_contact || emergencyNumbers['tourist_police'] || '0542-2200441'
  };
}

export function isEmergencySituation(alerts: ScamAlert[]): boolean {
  return alerts.some(alert => alert.severity === 'high');
}

export function formatScamAlert(alert: ScamAlert): string {
  let output = `\n${alert.warning_message}\n\n`;

  output += `**Prevention Tips:**\n`;
  alert.prevention_tips.forEach(tip => {
    output += `• ${tip}\n`;
  });

  output += `\n**Need Help?** Call: ${alert.emergency_number}\n`;

  return output;
}

export function formatMultipleAlerts(alerts: ScamAlert[]): string {
  if (alerts.length === 0) return '';

  let output = `\n🛡️ **Safety Check Results:**\n`;
  output += `Found ${alerts.length} potential concern(s):\n\n`;

  alerts.forEach((alert, index) => {
    output += `**${index + 1}. ${alert.type.toUpperCase().replace(/_/g, ' ')}**\n`;
    output += `${alert.warning_message}\n\n`;
  });

  // Show emergency message if high severity
  const highSeverityAlerts = alerts.filter(a => a.severity === 'high');
  if (highSeverityAlerts.length > 0) {
    output += `🚨 **Immediate Action Needed:**\n`;
    output += `Contact: ${highSeverityAlerts[0].emergency_number}\n`;
  }

  return output;
}

export function getSafetyTips(): string {
  const advisory = getSafetyAdvisory();
  if (!advisory) return '';

  let output = `\n🛡️ **Banaras Safety Advisory**\n\n`;

  output += `**Emergency Numbers:**\n`;
  Object.entries(advisory.emergency_numbers).forEach(([service, number]) => {
    output += `• ${service}: ${number}\n`;
  });

  output += `\n**Common Risky Situations & How to Handle:**\n`;
  advisory.common_risky_situations.forEach((situation: any) => {
    output += `• **${situation.situation}**\n`;
    output += `  → ${situation.response}\n`;
    output += `  → Helpline: ${situation.helpline}\n\n`;
  });

  return output;
}

// Function to check if message contains risky keywords
export function hasRiskyKeywords(message: string): boolean {
  const riskyKeywords = [
    'help',
    'emergency',
    'police',
    'threat',
    'danger',
    'scam',
    'cheat',
    'steal',
    'abuse',
    'assault'
  ];

  return riskyKeywords.some(keyword => message.toLowerCase().includes(keyword));
}
