# TypeScript Type Management Knowledge Base

## 1. Type Imports and Database Alignment
- Always import types from their correct paths (e.g., `import { Client, CreateClientDto } from '@/types/client'`)
- Ensure database column names match TypeScript interfaces exactly (e.g., `user_id` not `userId`)
- Keep DTO (Data Transfer Object) types separate from database entity types

## 2. Client Creation Pattern

```typescript
// Good Practice:
interface Client {
  id: string;
  name: string;
  email: string;
  user_id: string;
  // ... other fields
}

interface CreateClientDto {
  name: string;
  email: string;
  // Omit auto-generated fields (id, user_id, timestamps)
}
```

## 3. Hook Design Patterns
- Handle auto-generated fields (like `user_id`) within the hook, not in the component
- Use proper type definitions for hook return values
- Implement caching strategies (like checking local state before fetching)
- Export all necessary methods from hooks (e.g., `getClient`)

## 4. Type Safety in Form Submissions
- Use DTOs for form submissions instead of full entity types
- Validate required fields at both type and runtime levels
- Handle optional fields explicitly
- Transform data before database operations

## 5. Common Fixes for Type Errors
- For "Property 'X' is missing": Check if the property should be handled internally
- For "Cannot find name 'Type'": Ensure proper type imports
- For type mismatches: Use proper type intersections or omit specific properties

## 6. Best Practices

```typescript
// Hook Implementation
const createClient = async (clientData: CreateClientDto) => {
  // Handle user_id internally
  const client = {
    ...clientData,
    user_id: (await supabase.auth.getUser()).data.user?.id
  };
  // Database operation
};

// Component Usage
const handleSubmit = async (values: CreateClientDto) => {
  const result = await createClient(values);
};
```

## 7. Project Structure
- Keep types in dedicated files (e.g., `types/client.ts`)
- Maintain consistent naming conventions
- Use barrel exports for related types
- Keep database types and frontend DTOs aligned

## 8. Error Prevention Checklist
✓ Verify all required type imports
✓ Check for proper type definitions
✓ Ensure DTO types match form data
✓ Handle automatic fields in hooks
✓ Validate type consistency with database schema

## 9. Database Integration
- Match Supabase column types with TypeScript types
- Handle nullable fields appropriately
- Use proper type assertions for database responses

## 10. Testing and Validation
- Test type compatibility before implementation
- Validate form data against DTOs
- Ensure proper error handling with typed errors
