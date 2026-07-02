# Disable path length limits just in case
git config core.longpaths true

# Commit 1
git add backend/prisma backend/package.json backend/package-lock.json backend/src/main.ts backend/seed-admin.ts
git commit -m "feat(db): update schema, db push, and public folder config"

# Commit 2
git add backend/src/modules/roles
git commit -m "feat(roles): implement roles module for RBAC"

# Commit 3
git add backend/src/modules/auth backend/src/common backend/src/core
git commit -m "feat(auth): enhance auth flow with roles and db adapter"

# Commit 4
git add backend/src/modules/users
git commit -m "feat(users): implement user management CRUD and avatar upload"

# Commit 5
git add backend/src/modules/products backend/src/modules/categories
git commit -m "feat(catalog): enhance products and categories endpoints"

# Commit 6
git add backend/src/modules/customers backend/src/modules/suppliers
git commit -m "feat(crm): enhance customers and suppliers endpoints"

# Commit 7
git add backend/src/modules/sales
git commit -m "feat(sales): add sales and billing backend logic"

# Commit 8
git add backend/src/modules/stock-levels backend/src/modules/stock-movements backend/src/modules/stock-transfers
git commit -m "feat(stock): complete stock movements, levels and transfers modules"

# Commit 9
git add backend/src/modules/analytics backend/src/modules/purchase-orders backend/src/modules/notifications backend/tsconfig.build.tsbuildinfo
git commit -m "feat(backend): complete analytics, purchase-orders, and notifications"

# Commit 10
git add frontend/package.json frontend/package-lock.json frontend/src/types
git commit -m "feat(frontend): update dependencies and global types"

# Commit 11
git add frontend/src/api frontend/src/contexts frontend/src/middleware.ts
git commit -m "feat(frontend-core): axios interceptors, auth context and RBAC middleware"

# Commit 12
git add frontend/src/components/layout frontend/src/app/login
git commit -m "feat(ui): update layout sidebar, header and login screens"

# Commit 13
git add frontend/src/app/dashboard/users frontend/src/features/users frontend/src/components/shared
Remove-Item *.js -Force -ErrorAction SilentlyContinue
git add .
git commit -m "feat(ui-users): implement user management dashboard page and final cleanup"

# Push the commits
git push
