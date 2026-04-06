

## Auditoría Completa de la Plataforma CTHub

Tras revisar el código, la base de datos, las funciones edge, y los logs, aquí están todos los problemas encontrados organizados por prioridad.

---

### CRITICOS (Bloquean funcionalidad)

**1. Registro de empresa falla por RLS**
- El log muestra: `"new row violates row-level security policy for table companies"`
- Causa: Al registrarse, el usuario crea la cuenta y luego intenta insertar en `companies`. Pero el token de sesión aún no está disponible inmediatamente después de `signUp`, así que `auth.uid()` no coincide con `user_id`.
- Fix: Mover la creación de empresa a un trigger de base de datos o a una función `SECURITY DEFINER`, o esperar a que la sesión esté activa antes de crear la empresa.

**2. Tabla `subscribers` no existe**
- La función edge `check-subscription` consulta una tabla `subscribers` que no fue creada en la migración.
- Resultado: Cada vez que un usuario inicia sesión, el `SubscriptionProvider` llama a `check-subscription` y falla con error 500.
- Fix: Crear la tabla `subscribers` o, si no se va a usar Stripe aún, desactivar el `SubscriptionProvider`.

**3. No hay `STRIPE_SECRET_KEY` configurada**
- La función `check-subscription` requiere `STRIPE_SECRET_KEY` que no está en los secrets de Supabase.
- Fix: Agregar la clave de Stripe o desactivar la funcionalidad de suscripción.

**4. No existe página `/reset-password`**
- El admin puede enviar reset de contraseña pero redirige a `/auth?reset=true`, que no maneja el flujo de reset.
- No hay componente que llame a `supabase.auth.updateUser({ password })`.
- Fix: Crear una página `/reset-password` que procese el token de recuperación.

---

### IMPORTANTES (Afectan experiencia de usuario)

**5. Empresa del usuario no se creó correctamente**
- El perfil de Omar tiene `company_id: null` y `user_subtype: company_admin`, pero no hay empresas en la tabla.
- Fix: Además de arreglar el flujo de registro, crear la empresa manualmente para el usuario existente.

**6. Dashboard duplicado**
- Existen `Index.tsx` y `DashboardContent.tsx` con código casi idéntico.
- La ruta `/` redirige a `/dashboard` que usa `DashboardContent`, pero `Index.tsx` también tiene lógica de dashboard.
- Fix: Eliminar `Index.tsx` o consolidar en un solo componente.

**7. Dashboard carga extra_charges con N+1 queries**
- `useDashboardData` hace una consulta por cada transfer para obtener `extra_charges`.
- Con 100 transfers = 101 queries.
- Fix: Una sola consulta con `transfer_id IN (...)`.

**8. Falta foreign keys en la base de datos**
- Ninguna tabla tiene foreign keys definidas (bill_items->bills, extra_charges->transfers, etc.).
- Los datos pueden quedar huérfanos y no hay integridad referencial.
- Fix: Agregar foreign keys con `ON DELETE CASCADE`.

---

### MEJORAS NECESARIAS

**9. ProtectedRoute sin tipado TypeScript**
- `ProtectedRoute` y `AuthRoute` en `App.tsx` usan `({ children })` sin tipos.
- Fix: Agregar `React.FC<{ children: React.ReactNode }>`.

**10. Perfil usa `role` directamente en la tabla profiles**
- La documentación de seguridad dice que los roles deben estar en tabla separada. El `has_role` function consulta `profiles.role` directamente.
- Riesgo: Un usuario podría cambiar su propio rol a 'admin' si la política UPDATE no protege el campo `role`.
- Fix: Proteger el campo `role` en la política UPDATE o mover a tabla separada.

**11. Sin storage bucket para logos de empresa**
- El perfil tiene campo `company_logo` pero no hay bucket de storage configurado.
- Fix: Crear bucket `logos` en Supabase Storage.

**12. Edge functions usan versiones antiguas de Deno std**
- `std@0.190.0` y `stripe@14.21.0` están desactualizados.
- Fix: Actualizar a versiones recientes.

---

### PLAN DE IMPLEMENTACION

Se ejecutará en este orden:

1. **Crear tabla `subscribers`** con migración SQL y agregar foreign keys faltantes a todas las tablas
2. **Arreglar flujo de registro de empresa** - usar función SECURITY DEFINER para crear empresa + actualizar perfil atomicamente
3. **Crear empresa para usuario existente** (Omar) via INSERT
4. **Crear página `/reset-password`** con el flujo completo
5. **Eliminar dashboard duplicado** y optimizar queries N+1
6. **Agregar tipado TypeScript** a ProtectedRoute/AuthRoute
7. **Proteger campo `role`** en política UPDATE de profiles
8. **Crear storage bucket** para logos

### Detalles Tecnicos

Migration SQL incluirá:
- `CREATE TABLE subscribers` con columnas: id, email, user_id, stripe_customer_id, subscribed, subscription_tier, subscription_end, created_at, updated_at
- `ALTER TABLE` para agregar foreign keys en bill_items, extra_charges, expenses
- Función `create_company_for_user()` SECURITY DEFINER
- Política UPDATE restrictiva en profiles para proteger `role`

Nuevos archivos:
- `src/pages/auth/ResetPasswordPage.tsx`
- Ruta `/reset-password` en App.tsx

Archivos a modificar:
- `src/hooks/auth/useAuthForms.ts` (usar función DB para crear empresa)
- `src/App.tsx` (tipos, nueva ruta, eliminar import de Index)
- `src/hooks/useDashboardData.ts` (optimizar queries)
- `src/pages/Index.tsx` (eliminar o redirigir)

