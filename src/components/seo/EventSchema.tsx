import { Helmet } from 'react-helmet-async';
import { config } from '@/config';

interface EventSchemaProps {
  event: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: {
      name: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    image?: string;
    offers?: Array<{
      name: string;
      price: number;
      priceCurrency?: string;
      availability: 'InStock' | 'SoldOut' | 'PreOrder';
      validFrom?: string;
      validThrough?: string;
      url?: string;
    }>;
    organizer?: {
      name: string;
      url?: string;
    };
    eventStatus?: 'EventScheduled' | 'EventPostponed' | 'EventCancelled' | 'EventMovedOnline';
    eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
    maximumAttendeeCapacity?: number;
    remainingAttendeeCapacity?: number;
  };
  pageUrl: string;
}

export function EventSchema({ event, pageUrl }: EventSchemaProps) {
  // Event Schema
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.address,
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        postalCode: event.location.postalCode,
        addressCountry: event.location.country,
      },
    },
    image: event.image,
    offers: event.offers?.map(offer => ({
      '@type': 'Offer',
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.priceCurrency || 'USD',
      availability: `https://schema.org/${offer.availability}`,
      validFrom: offer.validFrom,
      validThrough: offer.validThrough,
      url: offer.url || pageUrl,
    })),
    organizer: event.organizer && {
      '@type': 'Organization',
      name: event.organizer.name,
      url: event.organizer.url,
    },
    eventStatus: event.eventStatus && `https://schema.org/${event.eventStatus}`,
    eventAttendanceMode: event.eventAttendanceMode && `https://schema.org/${event.eventAttendanceMode}`,
    maximumAttendeeCapacity: event.maximumAttendeeCapacity,
    remainingAttendeeCapacity: event.remainingAttendeeCapacity,
  };

  // Ticket Availability Schema
  const ticketAvailabilitySchema = event.offers && {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...event.offers.map(offer => offer.price)),
      highPrice: Math.max(...event.offers.map(offer => offer.price)),
      priceCurrency: 'USD',
      availability: event.offers.some(offer => offer.availability === 'InStock')
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      validFrom: event.offers[0]?.validFrom,
      validThrough: event.offers[0]?.validThrough,
      offerCount: event.offers.length,
    },
  };

  return (
    <Helmet>
      {/* Event Meta Tags */}
      <meta property="event:start_time" content={event.startDate} />
      {event.endDate && (
        <meta property="event:end_time" content={event.endDate} />
      )}
      <meta property="event:location" content={event.location.name} />
      <meta property="event:availability" content={
        event.offers?.some(offer => offer.availability === 'InStock')
          ? 'available'
          : 'unavailable'
      } />

      {/* Open Graph Event Tags */}
      <meta property="og:type" content="event" />
      <meta property="og:title" content={event.name} />
      <meta property="og:description" content={event.description} />
      {event.image && (
        <meta property="og:image" content={event.image} />
      )}
      <meta property="og:start_time" content={event.startDate} />
      {event.endDate && (
        <meta property="og:end_time" content={event.endDate} />
      )}
      <meta property="og:location" content={`${event.location.name}, ${event.location.address}`} />

      {/* Event Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(eventSchema)}
      </script>

      {/* Ticket Availability Structured Data */}
      {ticketAvailabilitySchema && (
        <script type="application/ld+json">
          {JSON.stringify(ticketAvailabilitySchema)}
        </script>
      )}
    </Helmet>
  );
}