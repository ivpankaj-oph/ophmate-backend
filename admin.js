import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import { sequelize } from './services/database/database.js'
import { initModels } from './models/index.js'

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
})

const { User, Vendor, Product } = initModels(sequelize)

console.log("User model loaded:", !!User) // ✅ should be true

const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  resources: [User, Vendor, Product],
  branding: {
    companyName: 'OphMate Admin',
  },
})

const ADMIN = {
  email: 'admin@example.com',
  password: 'password123',
}

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) return ADMIN
    return null
  },
  cookiePassword: 'some-secret-password',
})

export { adminJs, router }
