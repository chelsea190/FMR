# Find Me RX - Frontend Architecture

## Overview

Find Me RX is a location-based medication access platform built with Next.js 14, TypeScript, and Tailwind CSS. The frontend is designed to be scalable, maintainable, and ready for mobile app conversion.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Architecture Patterns

### 1. File-based Routing (Next.js App Router)

```
app/
├── (auth)/          # Route group for auth pages
├── (dashboard)/     # Route group for protected pages
└── layout.tsx       # Root layout
```

### 2. Component Organization

- **UI Components** (`components/ui/`): Reusable, presentational components
- **Feature Components** (`components/`): Domain-specific components
- **Layout Components** (`components/layout/`): Page layouts and navigation

### 3. API Client Pattern

Centralized API client with:
- Automatic token injection
- Token refresh handling
- Error handling
- Type-safe responses

### 4. Type Safety

- Shared types in `types/index.ts`
- API responses typed with generics
- Form validation with Zod schemas

## Key Features Implementation

### Authentication Flow

1. User signs up/logs in
2. JWT tokens stored in HTTP-only cookies (via backend) or client-side cookies
3. Tokens automatically attached to API requests
4. Token refresh on 401 errors
5. Protected routes check authentication

### Role-Based Access Control

- User role stored in JWT token
- Dashboard layout adapts based on role
- Navigation items filtered by role
- API endpoints enforce role permissions (backend)

### Pharmacy Discovery

1. Get user location (browser geolocation API)
2. Query backend for nearby pharmacies
3. Calculate distances
4. Display on map (Google Maps integration ready)
5. Filter and search functionality

### Real-time Chat

1. Socket.IO connection on chat page load
2. Join conversation rooms
3. Send/receive messages in real-time
4. Mark messages as read
5. Conversation list updates

### Order Management

1. Add items to cart
2. Create order via API
3. Track order status
4. Update status (pharmacist)
5. Payment integration (Paystack)

### Inventory Management (Pharmacist)

1. Search drugs from database
2. Add to pharmacy inventory
3. Set price and stock
4. Update availability
5. CRUD operations

## State Management

### Local State
- Component-level state with `useState`
- Form state with React Hook Form

### Global State
- Auth context for user data
- Socket connection management

### Server State
- API calls with Axios
- No external state management library (can add React Query if needed)

## Security Considerations

1. **Token Storage**: Cookies (can be HTTP-only via backend)
2. **XSS Protection**: React's built-in escaping
3. **CSRF Protection**: SameSite cookies
4. **Input Validation**: Zod schemas
5. **API Security**: Tokens in Authorization header

## Performance Optimizations

1. **Code Splitting**: Automatic with Next.js App Router
2. **Image Optimization**: Next.js Image component (when needed)
3. **Lazy Loading**: Dynamic imports for heavy components
4. **Caching**: API response caching (can add React Query)

## Mobile Readiness

- Responsive design with Tailwind CSS
- Touch-friendly UI components
- Mobile-first approach
- Can be converted to React Native using:
  - Shared business logic
  - Similar component structure
  - API client reusable

## API Integration

### Request Flow
1. User action triggers API call
2. API client adds auth token
3. Request sent to backend
4. Response handled with error checking
5. UI updated with data

### Error Handling
- Network errors: Toast notification
- Auth errors: Redirect to login
- Validation errors: Form field errors
- Server errors: Error messages

## Real-time Features

### WebSocket Connection
- Established on chat page
- Reconnects automatically
- Event-based messaging
- Room-based conversations

## Payment Flow

1. User completes order
2. Paystack button component loads
3. Payment modal opens
4. User completes payment
5. Callback verifies payment
6. Order status updated

## File Structure

```
├── app/                    # Next.js pages
│   ├── (auth)/            # Public auth routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base components
│   ├── layout/           # Layouts
│   └── payment/          # Payment components
├── lib/                   # Utilities
│   ├── api/              # API clients
│   └── utils.ts          # Helpers
├── types/                 # TypeScript types
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
└── middleware.ts          # Next.js middleware
```

## Future Enhancements

1. **State Management**: Add React Query for server state
2. **Testing**: Add Jest + React Testing Library
3. **PWA**: Add service worker for offline support
4. **Analytics**: Add tracking for user behavior
5. **Notifications**: Push notifications for orders
6. **Maps**: Full Google Maps integration
7. **Search**: Advanced drug search with filters
8. **Reviews**: Pharmacy and drug reviews
9. **Favorites**: Save favorite pharmacies
10. **History**: Order and prescription history

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Google Maps API key added
- [ ] Paystack keys configured
- [ ] CORS settings on backend
- [ ] HTTPS enabled (required for geolocation)
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics setup
- [ ] Performance monitoring
- [ ] SEO optimization

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Type Checking**: TypeScript compiler
3. **Linting**: ESLint (Next.js default)
4. **Building**: `npm run build`
5. **Testing**: Manual testing (add automated tests)

## API Contract

The frontend expects RESTful APIs with:
- JSON request/response format
- JWT authentication
- Standard HTTP status codes
- Consistent error format
- Pagination support

## Conclusion

This architecture provides a solid foundation for a production-ready application that can scale and be easily converted to a mobile app. The codebase follows best practices and is maintainable for a growing team.
