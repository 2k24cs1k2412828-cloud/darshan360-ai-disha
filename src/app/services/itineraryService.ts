// Itinerary Generation Service
// Creates personalized 1/2/3 day itineraries based on user preferences

import { loadBanaarasDatabase, getAllPlaces, getPlaceById, getCostEstimate, getItineraryByDuration } from './madhyaPradeshService';

export type ItineraryDuration = 1 | 2 | 3;
export type PreferenceType = 'boat' | 'café' | 'spiritual' | 'budget' | 'luxury' | 'photography' | 'adventure' | 'cultural';

interface ItineraryItem {
  time: string;
  activity: string;
  place_id?: string;
  place_name?: string;
  estimated_cost: string;
  duration_minutes: number;
  notes: string;
  category?: string;
}

interface GeneratedItinerary {
  title: string;
  duration_days: number;
  total_cost_estimate: string;
  preferences_applied: PreferenceType[];
  schedule: {
    [key: string]: ItineraryItem[];
  };
  tips: string[];
  emergency_contacts: { [key: string]: string };
}

// Preference configurations
const preferenceConfigs: Record<PreferenceType, { places: string[]; keywords: string[] }> = {
  boat: {
    places: ['assi_ghat', 'dashashwamedh_ghat', 'manikarnika_ghat'],
    keywords: ['boat', 'river', 'ghat', 'water']
  },
  café: {
    places: ['blue_lassi'],
    keywords: ['food', 'lassi', 'drink', 'café', 'restaurant']
  },
  spiritual: {
    places: ['kashi_vishwanath', 'sarnath', 'manikarnika_ghat', 'dashashwamedh_ghat'],
    keywords: ['temple', 'spiritual', 'sacred', 'pilgrimage', 'meditation', 'yoga']
  },
  budget: {
    places: ['blue_lassi', 'assi_ghat'],
    keywords: ['cheap', 'affordable', 'budget', 'free', 'inexpensive']
  },
  luxury: {
    places: ['ramnagar_fort', 'banaras_hindu_university'],
    keywords: ['luxury', 'premium', 'comfort', 'exclusive']
  },
  photography: {
    places: ['dashashwamedh_ghat', 'assi_ghat', 'manikarnika_ghat', 'ramnagar_fort'],
    keywords: ['photo', 'picture', 'photography', 'scenic', 'view']
  },
  adventure: {
    places: ['sarnath', 'banaras_hindu_university', 'ramnagar_fort'],
    keywords: ['adventure', 'explore', 'trek', 'discover', 'travel']
  },
  cultural: {
    places: ['kashi_vishwanath', 'sarnath', 'banaras_hindu_university', 'ramnagar_fort'],
    keywords: ['culture', 'heritage', 'history', 'tradition', 'ancient']
  }
};

export async function generateItinerary(
  duration: ItineraryDuration,
  preferences: PreferenceType[],
  budgetLevel: 'budget' | 'moderate' | 'luxury' = 'moderate'
): Promise<GeneratedItinerary> {
  try {
    await loadBanaarasDatabase();
    
    const schedule: { [key: string]: ItineraryItem[] } = {};
    const selectedPlaces: string[] = [];
    const tips: string[] = [];

    // Collect places based on preferences
    preferences.forEach(pref => {
      selectedPlaces.push(...preferenceConfigs[pref].places);
    });

    // Remove duplicates
    const uniquePlaces = Array.from(new Set(selectedPlaces));

    // Generate schedule for each day
    for (let day = 1; day <= duration; day++) {
      schedule[`day_${day}`] = generateDaySchedule(day, duration, uniquePlaces, budgetLevel);
    }

    // Generate tips based on preferences
    if (preferences.includes('spiritual')) {
      tips.push('Remember to remove shoes at temples. Dress modestly with covered shoulders and knees.');
      tips.push('Photography may be restricted in certain temple areas. Always ask for permission.');
    }
    if (preferences.includes('boat')) {
      tips.push('Negotiate boat prices BEFORE boarding. Standard sunrise/sunset rides: ₹100-250 per person.');
      tips.push('Morning boat rides (5-6 AM) offer the best light for photography and fewer crowds.');
    }
    if (preferences.includes('budget')) {
      tips.push('Eat where locals eat - street food and small restaurants offer best value.');
      tips.push('Stay in Assi Ghat or Dashashwamedh area for easy access to attractions without taking autos.');
    }
    if (preferences.includes('photography')) {
      tips.push('Golden hour (early morning 5-7 AM and evening 5-7 PM) provides best lighting.');
      tips.push('Get permission before photographing people. Be respectful at cremation ghats.');
    }

    // Calculate total cost estimate
    const totalCost = calculateTotalCost(schedule, budgetLevel);

    return {
      title: `${duration}-Day Itinerary for Banaras (${preferences.join(', ')})`,
      duration_days: duration,
      total_cost_estimate: totalCost,
      preferences_applied: preferences,
      schedule,
      tips,
      emergency_contacts: {
        'Tourist Police': '0542-2200441',
        'Ambulance': '102',
        'Police Emergency': '100',
        'Tourism Helpline': '0542-2206164'
      }
    };
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary');
  }
}

function generateDaySchedule(
  dayNumber: number,
  totalDays: ItineraryDuration,
  places: string[],
  budgetLevel: string
): ItineraryItem[] {
  const schedule: ItineraryItem[] = [];

  if (dayNumber === 1) {
    // Day 1: Classic Banaras experience
    schedule.push({
      time: '5:00 AM - 6:30 AM',
      activity: 'Sunrise Boat Ride',
      place_id: 'assi_ghat',
      place_name: 'Assi Ghat',
      estimated_cost: '₹100-150',
      duration_minutes: 90,
      notes: 'Best time for photography and peaceful river experience',
      category: 'boat'
    });

    schedule.push({
      time: '7:00 AM - 8:00 AM',
      activity: 'Breakfast',
      estimated_cost: '₹50-150',
      duration_minutes: 60,
      notes: 'Try local Banaras specialties like poori-sabzi or lassi',
      category: 'food'
    });

    if (places.includes('kashi_vishwanath')) {
      schedule.push({
        time: '8:30 AM - 9:30 AM',
        activity: 'Visit Kashi Vishwanath Temple',
        place_id: 'kashi_vishwanath',
        place_name: 'Kashi Vishwanath Temple',
        estimated_cost: '₹0-100',
        duration_minutes: 60,
        notes: 'Ancient Shiva temple, one of 12 Jyotirlingas. Arrive early to avoid crowds.',
        category: 'temple'
      });
    }

    schedule.push({
      time: '10:00 AM - 1:00 PM',
      activity: 'Explore Ghats & Narrow Lanes',
      estimated_cost: '₹0',
      duration_minutes: 180,
      notes: 'Walk through old Varanasi, discover local culture, street art',
      category: 'cultural'
    });

    schedule.push({
      time: '1:00 PM - 2:30 PM',
      activity: 'Lunch',
      estimated_cost: budgetLevel === 'budget' ? '₹50-100' : '₹150-300',
      duration_minutes: 90,
      notes: 'Visit local market for authentic food or Blue Lassi shop',
      category: 'food'
    });

    schedule.push({
      time: '2:30 PM - 5:00 PM',
      activity: 'Rest at Hotel/Café',
      estimated_cost: budgetLevel === 'luxury' ? '₹300-500' : '₹0-100',
      duration_minutes: 150,
      notes: 'Recharge for evening activities',
      category: 'rest'
    });

    schedule.push({
      time: '6:00 PM - 8:00 PM',
      activity: 'Ganga Aarti Ceremony',
      place_id: 'dashashwamedh_ghat',
      place_name: 'Dashashwamedh Ghat',
      estimated_cost: places.includes('dashashwamedh_ghat') ? '₹200-800' : '₹0',
      duration_minutes: 120,
      notes: 'Most famous ceremony in Varanasi. Arrive early. Can watch from ghats (free) or from boat.',
      category: 'spiritual'
    });

    schedule.push({
      time: '8:30 PM onwards',
      activity: 'Dinner & Relax',
      estimated_cost: '₹100-200',
      duration_minutes: 60,
      notes: 'Enjoy street food or restaurant meal',
      category: 'food'
    });
  } else if (dayNumber === 2 && totalDays >= 2) {
    // Day 2: Sarnath or deeper exploration
    schedule.push({
      time: '8:00 AM - 9:00 AM',
      activity: 'Breakfast',
      estimated_cost: '₹50-150',
      duration_minutes: 60,
      notes: 'Light breakfast for early day trip',
      category: 'food'
    });

    if (places.includes('sarnath')) {
      schedule.push({
        time: '9:30 AM - 1:30 PM',
        activity: 'Day Trip to Sarnath',
        place_id: 'sarnath',
        place_name: 'Sarnath',
        estimated_cost: '₹350-500',
        duration_minutes: 240,
        notes: 'Buddha\'s first sermon site. 10 km from Varanasi. Includes entry + transport + guide.',
        category: 'spiritual'
      });

      schedule.push({
        time: '1:30 PM - 2:30 PM',
        activity: 'Lunch at Sarnath',
        estimated_cost: '₹100-200',
        duration_minutes: 60,
        notes: 'Limited options at Sarnath, consider eating before returning',
        category: 'food'
      });

      schedule.push({
        time: '2:30 PM - 4:00 PM',
        activity: 'Return to Varanasi',
        estimated_cost: '₹100-200',
        duration_minutes: 90,
        notes: 'Travel back by shared taxi or private vehicle',
        category: 'transport'
      });
    }

    schedule.push({
      time: '4:00 PM - 6:00 PM',
      activity: 'Rest & Shopping',
      estimated_cost: budgetLevel === 'luxury' ? '₹500-1000' : '₹100-500',
      duration_minutes: 120,
      notes: 'Visit local markets for souvenirs, handicrafts, textiles',
      category: 'shopping'
    });

    schedule.push({
      time: '6:30 PM - 8:00 PM',
      activity: 'Evening Exploration',
      estimated_cost: '₹0-100',
      duration_minutes: 90,
      notes: 'Explore different ghat or enjoy sunset from Ramnagar Fort',
      category: 'cultural'
    });

    schedule.push({
      time: '8:00 PM onwards',
      activity: 'Dinner & Rest',
      estimated_cost: '₹150-300',
      duration_minutes: 90,
      notes: '',
      category: 'food'
    });
  } else if (dayNumber === 3 && totalDays === 3) {
    // Day 3: Relaxed exploration and departure prep
    schedule.push({
      time: '5:00 AM - 6:30 AM',
      activity: 'Optional: Sunrise Yoga at Assi Ghat',
      estimated_cost: '₹200-500',
      duration_minutes: 90,
      notes: 'Many yoga centers offer early morning classes on the ghat',
      category: 'spiritual'
    });

    schedule.push({
      time: '7:00 AM - 8:30 AM',
      activity: 'Breakfast',
      estimated_cost: '₹50-150',
      duration_minutes: 90,
      notes: '',
      category: 'food'
    });

    if (places.includes('banaras_hindu_university')) {
      schedule.push({
        time: '9:00 AM - 12:00 PM',
        activity: 'BHU Campus Exploration',
        place_id: 'banaras_hindu_university',
        place_name: 'Banaras Hindu University',
        estimated_cost: '₹0-300',
        duration_minutes: 180,
        notes: 'India\'s oldest university, museum, beautiful colonial architecture',
        category: 'cultural'
      });
    }

    schedule.push({
      time: '12:30 PM - 1:30 PM',
      activity: 'Lunch',
      estimated_cost: '₹100-300',
      duration_minutes: 60,
      notes: '',
      category: 'food'
    });

    schedule.push({
      time: '2:00 PM - 4:00 PM',
      activity: 'Final Shopping & Souvenirs',
      estimated_cost: budgetLevel === 'luxury' ? '₹1000-3000' : '₹200-500',
      duration_minutes: 120,
      notes: 'Get last-minute gifts, handicrafts, silk textiles',
      category: 'shopping'
    });

    schedule.push({
      time: '4:00 PM onwards',
      activity: 'Prepare for Departure',
      estimated_cost: '₹0',
      duration_minutes: 0,
      notes: 'Pack, check out, arrange transport to station/airport',
      category: 'transport'
    });
  }

  return schedule;
}

function calculateTotalCost(schedule: { [key: string]: ItineraryItem[] }, budgetLevel: string): string {
  let minCost = 0;
  let maxCost = 0;

  Object.values(schedule).forEach(daySchedule => {
    daySchedule.forEach(item => {
      const costStr = item.estimated_cost.replace(/[₹,]/g, '');
      if (costStr.includes('-')) {
        const [min, max] = costStr.split('-').map(v => parseInt(v.trim(), 10));
        minCost += min;
        maxCost += max;
      }
    });
  });

  return `₹${minCost}-${maxCost}`;
}

export function formatItineraryForDisplay(itinerary: GeneratedItinerary): string {
  let output = `\n🎫 **${itinerary.title}**\n`;
  output += `💰 **Estimated Cost:** ${itinerary.total_cost_estimate}\n\n`;

  if (itinerary.preferences_applied.length > 0) {
    output += `🎯 **Preferences:** ${itinerary.preferences_applied.join(', ')}\n\n`;
  }

  Object.entries(itinerary.schedule).forEach(([dayKey, dayActivities]) => {
    const dayNum = dayKey.replace('day_', '');
    output += `**📅 Day ${dayNum}**\n`;
    dayActivities.forEach(item => {
      output += `• ${item.time}: **${item.activity}** - ${item.estimated_cost}\n`;
      if (item.notes) {
        output += `  _${item.notes}_\n`;
      }
    });
    output += '\n';
  });

  if (itinerary.tips.length > 0) {
    output += `**💡 Pro Tips:**\n`;
    itinerary.tips.forEach(tip => {
      output += `• ${tip}\n`;
    });
    output += '\n';
  }

  output += `**🚨 Emergency Numbers:**\n`;
  Object.entries(itinerary.emergency_contacts).forEach(([service, number]) => {
    output += `• ${service}: ${number}\n`;
  });

  return output;
}
