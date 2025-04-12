# TypeScript Best Practices for Transfer Management System

## Database Alignment
- All database interface types should match column names exactly (`user_id` not `userId`)
- Use snake_case for database columns and in TypeScript interfaces for database entities
- Use camelCase for frontend-only properties and local variables

## DTOs (Data Transfer Objects)
- Create separate DTO types for all create/update operations
- DTOs should never include auto-generated fields (id, user_id, timestamps)
- Example pattern:
  ```typescript
  // Entity (matches database exactly)
  interface Entity {
    id: string;
    user_id: string;
    created_at: string;
    // ... other fields
  }
  
  // Create DTO (for new entities)
  interface CreateEntityDto {
    // Only include user-provided fields
    // No id, user_id, timestamps
  }
  
  // Update DTO (for updating entities)
  interface UpdateEntityDto extends Partial<CreateEntityDto> {}
  ```

## Hook Design
- Hooks should handle all database interaction logic
- Always handle `user_id` and other auto fields inside hooks, not in components
- Return typed results from all hook methods
- Example:
  ```typescript
  function useEntity() {
    // ...
    const createEntity = async (data: CreateEntityDto): Promise<Entity | null> => {
      // Handle user_id automatically
      const entity = {
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };
      // Database operation
    };
    // ...
  }
  ```

## Common Errors and Solutions
- "Property 'X' is missing": Use DTOs for create/update operations
- "Cannot find name 'Type'": Add imports for all types
- "Type X is not assignable to type Y": Check for property mismatches

## Type Checking
- Use the type validation utilities in `src/lib/type-validators.ts`
- Validate all form inputs against proper types
- Use TypeScript's utility types (Partial, Pick, Omit) when needed

## Date & Currency Handling
- Always use consistent date formats when converting between display and storage
- Use the formatting utilities for currency according to regional settings
