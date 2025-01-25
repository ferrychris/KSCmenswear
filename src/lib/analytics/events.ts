import { performanceMonitor } from '../performance/monitor';

interface EventData {
  eventId: string;
  name: string;
  startDate: string;
  endDate?: string;
  location: string;
  category: string;
  ticketsSold?: number;
  revenue?: number;
  attendees?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface EventInteraction {
  eventId: string;
  userId?: string;
  action: 'view' | 'register' | 'attend' | 'cancel';
  timestamp: string;
  metadata?: Record<string, any>;
}

export class EventTracker {
  private static instance: EventTracker;
  private events: Map<string, EventData>;
  private interactions: Map<string, EventInteraction[]>;

  private constructor() {
    this.events = new Map();
    this.interactions = new Map();
  }

  static getInstance(): EventTracker {
    if (!EventTracker.instance) {
      EventTracker.instance = new EventTracker();
    }
    return EventTracker.instance;
  }

  trackEvent(data: EventData): void {
    this.events.set(data.eventId, data);

    // Track event metrics
    performanceMonitor.trackCustomMetric('event_tracking', {
      eventId: data.eventId,
      name: data.name,
      category: data.category,
      status: data.status,
      ticketsSold: data.ticketsSold,
      revenue: data.revenue,
      timestamp: new Date().toISOString(),
    });
  }

  trackInteraction(interaction: EventInteraction): void {
    const eventInteractions = this.interactions.get(interaction.eventId) || [];
    eventInteractions.push(interaction);
    this.interactions.set(interaction.eventId, eventInteractions);

    // Track interaction metrics
    performanceMonitor.trackCustomMetric('event_interaction', {
      eventId: interaction.eventId,
      userId: interaction.userId,
      action: interaction.action,
      timestamp: interaction.timestamp,
    });
  }

  getEventMetrics(eventId: string): {
    views: number;
    registrations: number;
    attendance: number;
    cancellations: number;
  } {
    const interactions = this.interactions.get(eventId) || [];
    
    return {
      views: interactions.filter(i => i.action === 'view').length,
      registrations: interactions.filter(i => i.action === 'register').length,
      attendance: interactions.filter(i => i.action === 'attend').length,
      cancellations: interactions.filter(i => i.action === 'cancel').length,
    };
  }

  getEventAnalytics(): {
    totalEvents: number;
    activeEvents: number;
    totalAttendees: number;
    totalRevenue: number;
  } {
    const events = Array.from(this.events.values());
    
    return {
      totalEvents: events.length,
      activeEvents: events.filter(e => e.status === 'scheduled' || e.status === 'in_progress').length,
      totalAttendees: events.reduce((sum, event) => sum + (event.attendees || 0), 0),
      totalRevenue: events.reduce((sum, event) => sum + (event.revenue || 0), 0),
    };
  }
}

export const eventTracker = EventTracker.getInstance();